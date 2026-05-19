ALPHABET = ("A", "C", "G", "T")


def clean_dna(value: str) -> str:
    return "".join(symbol for symbol in value.strip().upper() if symbol in ALPHABET)


def hamming_distance(first: str, second: str) -> int:
    limit = min(len(first), len(second))
    distance = sum(1 for i in range(limit) if first[i] != second[i])
    return distance + abs(len(first) - len(second))


def symbol_to_number(symbol: str) -> int:
    return {"A": 0, "C": 1, "G": 2, "T": 3}[symbol]


def number_to_symbol(number: int) -> str:
    return ["A", "C", "G", "T"][number]


def pattern_to_number(pattern: str) -> int:
    value = 0
    for symbol in pattern:
        value = value * 4 + symbol_to_number(symbol)
    return value


def number_to_pattern(number: int, k: int) -> str:
    pattern = ""
    current = number
    for _ in range(k):
        pattern = number_to_symbol(current % 4) + pattern
        current //= 4
    return pattern


def reverse_complement(pattern: str) -> str:
    complement = {"A": "T", "T": "A", "C": "G", "G": "C"}
    return "".join(complement[symbol] for symbol in reversed(pattern))


def neighbors(pattern: str, d: int) -> set[str]:
    if d == 0:
        return {pattern}
    if len(pattern) == 0:
        return {""}
    if len(pattern) == 1:
        return set(ALPHABET)

    neighborhood = set()
    suffix = pattern[1:]
    suffix_neighbors = neighbors(suffix, d)

    for text in suffix_neighbors:
        if hamming_distance(suffix, text) < d:
            for symbol in ALPHABET:
                neighborhood.add(symbol + text)
        else:
            neighborhood.add(pattern[0] + text)

    return neighborhood


def approximate_pattern_count(text: str, pattern: str, d: int) -> dict:
    positions = []
    k = len(pattern)

    for i in range(len(text) - k + 1):
        window = text[i : i + k]
        if hamming_distance(window, pattern) <= d:
            positions.append(i)

    return {"count": len(positions), "positions": positions}
