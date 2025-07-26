#!/bin/bash

# Diretório atual (onde o script está sendo executado)
BASE_DIR="$(pwd)"
OUTPUT_FILE="$BASE_DIR/estrutura_nodejs.txt"

# Limpa saída anterior
> "$OUTPUT_FILE"

# Extensões e nomes de arquivos relevantes
EXTENSOES_RELEVANTES="\.js$|\.ts$|\.jsx$|\.tsx$|\.json$|\.env$|\.sh$|\.config\..*|\.gitignore$|Dockerfile$|Makefile$|package\.json$|tsconfig\.json$|next\.config\.js$"

# Pastas a ignorar
IGNORAR_PASTAS="node_modules|\.git|\.next|dist|build"

# Função recursiva
function percorrer_pasta() {
    local dir="$1"
    local indent="$2"

    # Ignorar pastas específicas
    if [[ "$dir" =~ $IGNORAR_PASTAS ]]; then
        return
    fi

    echo "${indent}📁 $(basename "$dir")" >> "$OUTPUT_FILE"

    for item in "$dir"/*; do
        if [ -d "$item" ]; then
            percorrer_pasta "$item" "$indent    "
        elif [ -f "$item" ]; then
            if [[ "$item" =~ $EXTENSOES_RELEVANTES ]]; then
                echo "${indent}📄 $(basename "$item")" >> "$OUTPUT_FILE"
                echo "${indent}└── Conteúdo:" >> "$OUTPUT_FILE"
                sed "s/^/${indent}    /" "$item" >> "$OUTPUT_FILE"
                echo "${indent}──────────────────────────────" >> "$OUTPUT_FILE"
            fi
        fi
    done
}

# Execução
echo "📂 Estrutura do projeto Node.js – $(date)" >> "$OUTPUT_FILE"
echo "Pasta base: $BASE_DIR" >> "$OUTPUT_FILE"
echo "──────────────────────────────" >> "$OUTPUT_FILE"
percorrer_pasta "$BASE_DIR" ""

echo "✅ Arquivo gerado em: $OUTPUT_FILE"
