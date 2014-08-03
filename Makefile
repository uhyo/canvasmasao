all:compile cat

compile:
	tsc --out src.js src/canvasmasao.ts
cat:
	cat src/eventemitter3.js src.js > canvasmasao.js
	rm src.js
