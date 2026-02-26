def frequent_words(genome: str, k: int):
    genome = genome.strip().upper()

    if k > len(genome):
        return {"patterns": [], "max_count": 0}

    freq = {}
    for i in range(len(genome) - k + 1):
        p = genome[i:i+k]
        freq[p] = freq.get(p, 0) + 1

    max_count = max(freq.values()) if freq else 0
    patterns = sorted([p for p, c in freq.items() if c == max_count])

    return {"patterns": patterns, "max_count": max_count}
