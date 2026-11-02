#!/usr/bin/env bash
# Gera as Noto Sans do site (src/fonts/*.woff2) a partir dos TTF completos de public/fonts.
# Os TTF continuam lá para o PDF (o react-pdf não lê WOFF2); o site carrega só o recorte latino, bem menor.
# Precisa do fonttools com brotli:  python3 -m venv .venv-fontes && .venv-fontes/bin/pip install fonttools brotli
# Uso: PYFTSUBSET=.venv-fontes/bin/pyftsubset scripts/gerar-fontes-web.sh   (ou com pyftsubset no PATH)
set -euo pipefail

PYFTSUBSET="${PYFTSUBSET:-pyftsubset}"
# Latin-1 e Latin Estendido (nomes digitados pelo usuário), acentos combinantes, pontuação geral, setas e os símbolos
# que a interface usa (− ∴ ≡ ⊢ ◆ ✓ ✗); o que a Noto Sans não tiver continua caindo na fonte de reserva, como hoje.
UNICODES="U+0000-024F,U+0300-036F,U+2000-206F,U+20AC,U+2122,U+2190-21FF,U+2212,U+2234,U+2261,U+22A2,U+25C6,U+2713,U+2717,U+FEFF,U+FFFD"

mkdir -p src/fonts
for estilo in Regular Italic Bold; do
  "$PYFTSUBSET" "public/fonts/NotoSans-$estilo.ttf" \
    --unicodes="$UNICODES" --layout-features='*' --flavor=woff2 \
    --output-file="src/fonts/NotoSans-$estilo-latin.woff2"
done
ls -l src/fonts
