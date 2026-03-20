<template>
  <!-- ANIMATION: Card flips to reveal heatmap export preview -->
  <div class="flip-card" :class="{ flipped: isFlipped }" @click="flip">
    <!-- Front side: heatmap grid preview -->
    <div class="flip-front">
      <div class="export-label">
        <span class="material-symbols-outlined" style="font-size:14px">share</span>
        Click to preview export
      </div>
      <slot name="front" />
      <div class="flip-hint">↻ Flip</div>
    </div>

    <!-- Back side: simulated shareable screenshot -->
    <div class="flip-back">
      <div class="share-card">
        <div class="share-header">
          <img src="/logo-full.png" alt="KOVA" class="h-6 w-auto opacity-80" />
          <span class="share-username">@you</span>
        </div>

        <slot name="back">
          <!-- Fallback content -->
          <div class="share-stat">
            <span class="share-num">32</span>
            <span class="share-label">day streak</span>
          </div>
        </slot>

        <div class="share-footer">
          <span class="share-url">kova.app/u/you</span>
          <div class="qr-placeholder" />
        </div>
      </div>
      <button class="back-close" @click.stop="flip">← Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isFlipped = ref(false);
function flip() { isFlipped.value = !isFlipped.value; }
</script>

<style scoped>
/* ANIMATION: 3D card flip on click */
.flip-card {
  perspective: 1400px;
  cursor: pointer;
  position: relative;
}
.flip-front, .flip-back {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: transform 600ms cubic-bezier(0.34, 1.12, 0.64, 1);
  border-radius: 18px;
  overflow: hidden;
}
.flip-front {
  transform: rotateY(0deg);
  position: relative;
  background: #111;
  border: 0.5px solid rgba(255,255,255,0.07);
  padding: 20px;
}
.flip-back {
  position: absolute; inset: 0;
  transform: rotateY(-180deg);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #0a0a0a, #0d1a0d);
  border: 0.5px solid rgba(160,236,6,0.2);
}

.flip-card.flipped .flip-front { transform: rotateY(180deg); }
.flip-card.flipped .flip-back  { transform: rotateY(0deg); }

.export-label {
  display: flex; align-items: center; gap: 5px;
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;
  color: rgba(240,237,232,0.3); margin-bottom: 12px;
}
.flip-hint {
  font-size: 10px; color: rgba(240,237,232,0.2);
  text-align: right; margin-top: 10px;
}

/* Back side — shareable card design */
.share-card {
  width: 90%; padding: 20px 16px;
  background: #111;
  border-radius: 14px;
  border: 0.5px solid rgba(160,236,6,0.15);
  box-shadow: 0 0 30px rgba(160,236,6,0.08);
}
.share-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 16px;
}
.share-username {
  font-size: 11px; color: rgba(240,237,232,0.4);
}
.share-stat {
  display: flex; flex-direction: column; align-items: center;
  padding: 12px 0;
}
.share-num {
  font-family: 'Bodoni Moda', serif; font-weight: 900; font-size: 64px;
  color: #a0ec06; line-height: 1;
}
.share-label {
  font-size: 12px; color: rgba(240,237,232,0.5); margin-top: 4px;
}
.share-footer {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 16px; padding-top: 12px;
  border-top: 0.5px solid rgba(255,255,255,0.06);
}
.share-url { font-size: 10px; color: rgba(240,237,232,0.3); }
.qr-placeholder {
  width: 28px; height: 28px; border-radius: 4px;
  border: 1px solid rgba(240,237,232,0.15);
  background: repeating-conic-gradient(rgba(240,237,232,0.1) 0% 25%, transparent 0% 50%) 0 0 / 4px 4px;
}
.back-close {
  font-size: 11px; color: rgba(240,237,232,0.4); background: transparent; border: none;
  cursor: pointer; transition: color 150ms ease;
}
.back-close:hover { color: #a0ec06; }
</style>
