from services.bioinformatics_utils import clean_dna, pattern_to_number


def count_window_patterns(text: str, k: int) -> list[dict]:
    counts = {}
    order = []

    for i in range(len(text) - k + 1):
        pattern = text[i : i + k]
        if pattern not in counts:
            counts[pattern] = 0
            order.append(pattern)
        counts[pattern] += 1

    return [
        {"count": counts[pattern], "index": pattern_to_number(pattern), "pattern": pattern}
        for pattern in order
    ]


def analyze_clumps(genome: str, k: int, l: int, t: int) -> dict:
    genome = clean_dna(genome)
    if not genome or k > l or l > len(genome):
        return {
            "betterWindows": [],
            "clumpPatterns": [],
            "frequencyArraySize": 4**k,
            "windows": [],
        }

    windows = []
    clump_patterns = set()

    for start in range(len(genome) - l + 1):
        text = genome[start : start + l]
        entries = count_window_patterns(text, k)
        hits = [entry for entry in entries if entry["count"] >= t]

        for entry in hits:
            clump_patterns.add(entry["pattern"])

        windows.append(
            {
                "entries": entries,
                "enteringPattern": None if start == 0 else genome[start + l - k : start + l],
                "hits": hits,
                "leavingPattern": None if start == 0 else genome[start - 1 : start - 1 + k],
                "start": start,
                "text": text,
            }
        )

    running_counts = {
        entry["pattern"]: entry["count"] for entry in count_window_patterns(genome[:l], k)
    }
    better_windows = []

    for index, window in enumerate(windows):
        if index > 0:
            leaving = window["leavingPattern"]
            entering = window["enteringPattern"]
            running_counts[leaving] = running_counts.get(leaving, 0) - 1
            running_counts[entering] = running_counts.get(entering, 0) + 1

        entries = [
            {"count": count, "index": pattern_to_number(pattern), "pattern": pattern}
            for pattern, count in running_counts.items()
            if count > 0
        ]
        entries.sort(key=lambda item: item["pattern"])
        hits = [entry for entry in entries if entry["count"] >= t]

        better_windows.append({**window, "entries": entries, "hits": hits})

    return {
        "betterWindows": better_windows,
        "clumpPatterns": sorted(clump_patterns),
        "frequencyArraySize": 4**k,
        "windows": windows,
    }
