#!/usr/bin/env bash
cd packages/test && pnpm i
cd - && pnpm i && node test.js
