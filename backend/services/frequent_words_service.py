def _symbol_to_number(symbol: str) -> int:
    return {"A": 0, "C": 1, "G": 2, "T": 3}[symbol]


def _number_to_symbol(number: int) -> str:
    return ["A", "C", "G", "T"][number]


def _pattern_to_number(pattern: str) -> int:
    value = 0
    for symbol in pattern:
        value = value * 4 + _symbol_to_number(symbol)
    return value


def _number_to_pattern(number: int, k: int) -> str:
    pattern = ""
    current = number

    for _ in range(k):
        pattern = _number_to_symbol(current % 4) + pattern
        current //= 4

    return pattern


def _count_occurrences(text: str, pattern: str):
    positions = []

    for i in range(0, len(text) - len(pattern) + 1):
        if text[i:i + len(pattern)] == pattern:
            positions.append(i)

    return {"count": len(positions), "positions": positions}


def _analyze_frequent_words(genome: str, k: int):
    windows = []
    counts_by_pattern = {}
    running_dict = {}
    max_length = max(0, len(genome) - k + 1)

    for i in range(max_length):
        pattern = genome[i:i + k]
        occurrences = _count_occurrences(genome, pattern)
        running_dict[pattern] = running_dict.get(pattern, 0) + 1
        windows.append(
            {
                "index": i,
                "pattern": pattern,
                "count": occurrences["count"],
                "positions": occurrences["positions"],
                "numericIndex": _pattern_to_number(pattern),
                "runningCount": running_dict[pattern],
            }
        )
        counts_by_pattern[pattern] = max(
            counts_by_pattern.get(pattern, 0),
            occurrences["count"],
        )

    max_count = max(counts_by_pattern.values()) if counts_by_pattern else 0
    frequent_patterns = sorted(
        pattern for pattern, count in counts_by_pattern.items() if count == max_count
    )
    dict_counts = {}
    for item in windows:
        dict_counts[item["pattern"]] = dict_counts.get(item["pattern"], 0) + 1
    dict_entries = sorted(dict_counts.items())

    sorted_index = sorted(
        [
            {
                "index": item["numericIndex"],
                "pattern": item["pattern"],
                "originalPosition": item["index"],
            }
            for item in windows
        ],
        key=lambda item: (item["index"], item["originalPosition"]),
    )

    sorted_groups = []
    for item in sorted_index:
        previous = sorted_groups[-1] if sorted_groups else None
        if previous and previous["index"] == item["index"]:
            previous["count"] += 1
            previous["positions"].append(item["originalPosition"])
        else:
            sorted_groups.append(
                {
                    "index": item["index"],
                    "pattern": item["pattern"],
                    "count": 1,
                    "positions": [item["originalPosition"]],
                }
            )

    frequency_array_size = 4 ** k
    can_show_array = frequency_array_size <= 256
    frequency_array = []

    if can_show_array:
        frequency_array = [
            {
                "index": index,
                "pattern": _number_to_pattern(index, k),
                "count": 0,
            }
            for index in range(frequency_array_size)
        ]
        for item in windows:
            frequency_array[item["numericIndex"]]["count"] += 1

    return {
        "canShowArray": can_show_array,
        "countsByPattern": counts_by_pattern,
        "dictEntries": dict_entries,
        "frequentPatterns": frequent_patterns,
        "frequencyArray": frequency_array,
        "frequencyArraySize": frequency_array_size,
        "maxCount": max_count,
        "sortedGroups": sorted_groups,
        "sortedIndex": sorted_index,
        "windows": windows,
    }


def frequent_words(genome: str, k: int):
    genome = "".join(symbol for symbol in genome.strip().upper() if symbol in "ACGT")

    if k > len(genome):
        return {"patterns": [], "max_count": 0, "analysis": None}

    analysis = _analyze_frequent_words(genome, k)

    return {
        "patterns": analysis["frequentPatterns"],
        "max_count": analysis["maxCount"],
        "analysis": analysis,
    }
