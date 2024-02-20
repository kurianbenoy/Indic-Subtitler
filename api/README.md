# API for Indic-Subtitler

This directory contains the backend API for the Indic-Subtitler project, which is responsible for handling audio processing, transcription, and translation functionalities.

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip

### Installation

1. Clone the repository to your local machine.
2. Navigate to the `api/` directory.
3. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Running the API

To start the API server, run the following command:

```
modal deploy  server.py
```

## Style checks

- We are using [ruff](https://docs.astral.sh/ruff/), an extremely fast Python linter and code formatter, written in Rust for checking formatting and code styles.

For style checks use the following command:

```
# Ruff Identifies the issues
ruff check .
#  Ruff considers this a "fixable" error, so we can resolve the issue automatically by running
ruff check --fix
# Now that our project is passing ruff check, we can run the Ruff formatter via ruff format:
ruff format .
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the GPL-v2 LICENSE - see the [LICENSE](../LICENSE) file for details.