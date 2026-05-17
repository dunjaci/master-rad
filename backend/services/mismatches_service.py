from services.bioinformatics_utils import (
    approximate_pattern_count,
    clean_dna,
    hamming_distance,
    neighbors,
    reverse_complement,
)


def analyze_mismatches(text: str, pattern: str, k: int, d: int) -> dict:
    text = clean_dna(text)
    pattern = clean_dna(pattern)
    windows = []
    candidate_counts = {}
    candidate_sources = {}
    candidate_set = set()

    if pattern:
        for i in range(len(text) - len(pattern) + 1):
            window = text[i : i + len(pattern)]
            windows.append(
                {
                    "distance": hamming_distance(window, pattern),
                    "index": i,
                    "pattern": window,
                }
            )

    if text and k <= len(text):
        for i in range(len(text) - k + 1):
            kmer = text[i : i + k]
            for neighbor in neighbors(kmer, d):
                candidate_set.add(neighbor)
                candidate_counts[neighbor] = candidate_counts.get(neighbor, 0) + 1
                candidate_sources.setdefault(neighbor, []).append(i)

    candidate_entries = [
        {
            "candidate": candidate,
            "count": count,
            "reverse": reverse_complement(candidate),
            "sources": candidate_sources[candidate],
        }
        for candidate, count in candidate_counts.items()
    ]
    candidate_entries.sort(key=lambda item: (-item["count"], item["candidate"]))
    max_count = max((entry["count"] for entry in candidate_entries), default=0)
    frequent_patterns = sorted(
        entry["candidate"] for entry in candidate_entries if entry["count"] == max_count
    )

    reverse_entries = []
    for candidate in candidate_set:
        reverse = reverse_complement(candidate)
        direct = approximate_pattern_count(text, candidate, d)["count"]
        reverse_count = approximate_pattern_count(text, reverse, d)["count"]
        reverse_entries.append(
            {
                "candidate": candidate,
                "count": direct + reverse_count,
                "direct": direct,
                "reverse": reverse,
                "reverseCount": reverse_count,
            }
        )
    reverse_entries.sort(key=lambda item: (-item["count"], item["candidate"]))
    max_reverse_count = max((entry["count"] for entry in reverse_entries), default=0)
    reverse_frequent_patterns = sorted(
        entry["candidate"] for entry in reverse_entries if entry["count"] == max_reverse_count
    )

    return {
        "candidateEntries": candidate_entries,
        "candidateSetSize": len(candidate_set),
        "frequentPatterns": frequent_patterns,
        "maxCount": max_count,
        "maxReverseCount": max_reverse_count,
        "reverseEntries": reverse_entries,
        "reverseFrequentPatterns": reverse_frequent_patterns,
        "windows": windows,
    }


def analyze_hamming(first: str, second: str) -> dict:
    first = clean_dna(first)
    second = clean_dna(second)
    return {
        "distance": hamming_distance(first, second),
        "first": first,
        "second": second,
    }


def analyze_neighbors(pattern: str, d: int) -> dict:
    pattern = clean_dna(pattern)
    items = sorted(neighbors(pattern, d))
    return {"neighbors": items, "count": len(items)}


def analyze_approximate_count(text: str, pattern: str, d: int) -> dict:
    return approximate_pattern_count(clean_dna(text), clean_dna(pattern), d)
