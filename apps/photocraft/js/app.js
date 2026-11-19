/**
 * PhotoCraft (Photo & Raster) Engine Logic - MUNKEE STUDIO
 * Full browser-native raster photo editor with layers, filters, tools & IO.
 */

class PhotoCraftEngine {
  constructor() {
    this.canvas = document.getElementById('main-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = 800;
    this.height = 600;

    this.layers = [];
    this.activeLayerIndex = 0;
    this.currentTool = 'brush';
    this.currentColor = '#0066FF';
    this.brushSize = 10;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;

    this.init();
  }

  init() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Create background layer
    this.addLayer('Background', '#FFFFFF');

    // Register event listeners
    this.setupEventListeners();
    this.renderLayersList();
    this.updateStatus('PhotoCraft Ready (800x600 px)');
  }

  addLayer(name = `Layer ${this.layers.length + 1}`, fillColor = null) {
    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = this.width;
    layerCanvas.height = this.height;
    const layerCtx = layerCanvas.getContext('2d');

    if (fillColor) {
      layerCtx.fillStyle = fillColor;
      layerCtx.fillRect(0, 0, this.width, this.height);
    }

    const layer = {
      id: Date.now() + Math.random(),
      name,
      canvas: layerCanvas,
      ctx: layerCtx,
      visible: true,
      opacity: 1.0
    };

    this.layers.push(layer);
    this.activeLayerIndex = this.layers.length - 1;
    this.redrawCanvas();
    this.renderLayersList();
  }

  getActiveLayer() {
    return this.layers[this.activeLayerIndex];
  }

  redrawCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const layer of this.layers) {
      if (layer.visible) {
        this.ctx.globalAlpha = layer.opacity;
        this.ctx.drawImage(layer.canvas, 0, 0);
      }
    }
    this.ctx.globalAlpha = 1.0;
  }

  setupEventListeners() {
    // Mouse events for drawing
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseleave', () => this.stopDrawing());

    // Color picker
    const colorPicker = document.getElementById('color-picker');
    if (colorPicker) {
      colorPicker.addEventListener('input', (e) => {
        this.currentColor = e.target.value;
      });
    }

    // Brush size slider
    const brushSlider = document.getElementById('brush-size');
    if (brushSlider) {
      brushSlider.addEventListener('input', (e) => {
        this.brushSize = parseInt(e.target.value, 10);
      });
    }

    // Tools palette
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTool = btn.dataset.tool;
        this.updateStatus(`Selected Tool: ${this.currentTool.toUpperCase()}`);
      });
    });

    // Image Upload
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.loadImageFile(e));
    }
  }

  getCanvasCoordinates(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  startDrawing(e) {
    const { x, y } = this.getCanvasCoordinates(e);
    this.isDrawing = true;
    this.lastX = x;
    this.lastY = y;

    const layer = this.getActiveLayer();
    if (!layer || !layer.visible) return;

    if (this.currentTool === 'fill') {
      layer.ctx.fillStyle = this.currentColor;
      layer.ctx.fillRect(0, 0, this.width, this.height);
      this.redrawCanvas();
      this.isDrawing = false;
    } else if (this.currentTool === 'text') {
      const text = prompt('Enter text for photo canvas:', 'MUNKEE STUDIO');
      if (text) {
        layer.ctx.fillStyle = this.currentColor;
        layer.ctx.font = `${this.brushSize * 2}px Inter, sans-serif`;
        layer.ctx.fillText(text, x, y);
        this.redrawCanvas();
      }
      this.isDrawing = false;
    }
  }

  draw(e) {
    if (!this.isDrawing) return;
    const layer = this.getActiveLayer();
    if (!layer || !layer.visible) return;

    const { x, y } = this.getCanvasCoordinates(e);

    layer.ctx.beginPath();
    layer.ctx.moveTo(this.lastX, this.lastY);
    layer.ctx.lineTo(x, y);

    if (this.currentTool === 'brush') {
      layer.ctx.strokeStyle = this.currentColor;
      layer.ctx.lineWidth = this.brushSize;
      layer.ctx.lineCap = 'round';
      layer.ctx.lineJoin = 'round';
      layer.ctx.globalCompositeOperation = 'source-over';
      layer.ctx.stroke();
    } else if (this.currentTool === 'eraser') {
      layer.ctx.strokeStyle = 'rgba(0,0,0,1)';
      layer.ctx.lineWidth = this.brushSize * 1.5;
      layer.ctx.lineCap = 'round';
      layer.ctx.globalCompositeOperation = 'destination-out';
      layer.ctx.stroke();
    }

    this.lastX = x;
    this.lastY = y;
    this.redrawCanvas();
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  renderLayersList() {
    const container = document.getElementById('layers-list');
    if (!container) return;

    container.innerHTML = '';
    this.layers.slice().reverse().forEach((layer, revIdx) => {
      const actualIdx = this.layers.length - 1 - revIdx;
      const item = document.createElement('div');
      item.className = `layer-item ${actualIdx === this.activeLayerIndex ? 'active' : ''}`;
      item.innerHTML = `
        <span>${layer.name}</span>
        <div>
          <button onclick="window.photoCraft.toggleVisibility(${actualIdx})">${layer.visible ? '👁️' : '🙈'}</button>
        </div>
      `;
      item.addEventListener('click', () => {
        this.activeLayerIndex = actualIdx;
        this.renderLayersList();
      });
      container.appendChild(item);
    });
  }

  toggleVisibility(index) {
    if (this.layers[index]) {
      this.layers[index].visible = !this.layers[index].visible;
      this.redrawCanvas();
      this.renderLayersList();
    }
  }

  applyFilter(filterType) {
    const layer = this.getActiveLayer();
    if (!layer) return;

    const imageData = layer.ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (filterType === 'grayscale') {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      } else if (filterType === 'invert') {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      } else if (filterType === 'brightness') {
        data[i] = Math.min(255, data[i] + 30);
        data[i + 1] = Math.min(255, data[i + 1] + 30);
        data[i + 2] = Math.min(255, data[i + 2] + 30);
      }
    }

    layer.ctx.putImageData(imageData, 0, 0);
    this.redrawCanvas();
    this.updateStatus(`Filter applied: ${filterType}`);
  }

  loadImageFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        this.addLayer(file.name);
        const layer = this.getActiveLayer();
        layer.ctx.drawImage(img, 0, 0, this.width, this.height);
        this.redrawCanvas();
        this.updateStatus(`Loaded image: ${file.name}`);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  exportImage(format = 'png') {
    const dataUrl = this.canvas.toDataURL(`image/${format}`);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `photocraft-export.${format}`;
    a.click();
    this.updateStatus(`Exported image as ${format.toUpperCase()}`);
  }

  saveDraft() {
    const draft = {
      appId: 'photocraft',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      width: this.width,
      height: this.height,
      layers: this.layers.map(l => ({
        name: l.name,
        visible: l.visible,
        opacity: l.opacity,
        data: l.canvas.toDataURL('image/png')
      }))
    };
    localStorage.setItem('photocraft_saved_draft', JSON.stringify(draft));
    alert('Project draft saved to local browser storage.');
    this.updateStatus('Draft saved successfully');
  }

  updateStatus(msg) {
    const statusElem = document.getElementById('status-msg');
    if (statusElem) {
      statusElem.textContent = msg;
    }
  }
}

// Window attachment
window.addEventListener('DOMContentLoaded', () => {
  window.photoCraft = new PhotoCraftEngine();
});
