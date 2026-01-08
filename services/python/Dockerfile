FROM python:3.13-slim

WORKDIR /app

# Install uv for fast package management
RUN pip install --no-cache-dir uv

# Copy dependencies and install
COPY pyproject.toml ./
RUN uv pip install --system -e .

# Create directories for notebooks and data
RUN mkdir -p /app/notebooks /app/data

# Install Jupyter for notebooks
RUN uv pip install --system jupyter

EXPOSE 8888

CMD ["python", "-u", "src/main.py"]
