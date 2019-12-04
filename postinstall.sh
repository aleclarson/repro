echo '👋  Building with RTL latest...'
pnpm run build

echo '\n👋  Applying the patch...'
patch -d node_modules/@testing-library/react <540.diff

echo '\n👋  Building with RTL patched...'
pnpm run build

echo '\n👋  Reverting the patch...'
rm node_modules/@testing-library/react/index.d.ts
