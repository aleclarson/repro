pnpm install --ignore-scripts
echo ""

mkdir db 2>/dev/null
cd db
dolt sql < ../prepare.sql
dolt diff
