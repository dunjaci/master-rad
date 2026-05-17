from services.bioinformatics_utils import clean_dna


def analyze_skew(genome: str) -> dict:
    genome = clean_dna(genome)
    values = [0]
    current = 0

    for symbol in genome:
        if symbol == "G":
            current += 1
        elif symbol == "C":
            current -= 1
        values.append(current)

    minimum = min(values) if values else 0
    maximum = max(values) if values else 0
    minimum_positions = [index for index, value in enumerate(values) if value == minimum]
    maximum_positions = [index for index, value in enumerate(values) if value == maximum]
    steps = []

    for index, value in enumerate(values[1:]):
        previous = values[index]
        steps.append(
            {
                "delta": value - previous,
                "index": index + 1,
                "previous": previous,
                "symbol": genome[index],
                "value": value,
            }
        )

    return {
        "maximum": maximum,
        "maximumPositions": maximum_positions,
        "minimum": minimum,
        "minimumPositions": minimum_positions,
        "steps": steps,
        "values": values,
    }
