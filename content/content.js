class CaptureOverlay {
  constructor() {
    this.captureArea = document.createElement('div');
    this.captureArea.id = 'overlay';
    this.captureArea.style.position = 'fixed';
    this.captureArea.style.top = '0';
    this.captureArea.style.left = '0';
    this.captureArea.style.right = '0';
    this.captureArea.style.bottom = '0';
    this.captureArea.style.width = '100%';
    this.captureArea.style.height = '100%';
    this.captureArea.style.zIndex = '999';
    this.captureArea.style.cursor = 'crosshair';
    this.captureArea.style.backgroundColor = 'rgba(0,0,0,0.5)';
    this.captureArea.style.display = 'block';
  }

  initializeOverlay() {
    document.body.append(this.captureArea);
    return this.captureArea;
  }

  removeOverlay() {
    const currentOverlay = document.getElementById(this.captureArea.id);
    currentOverlay.remove();
  }
}

function main() {
  const captureOverlay = new CaptureOverlay();
  captureOverlay.initializeOverlay();
  setTimeout(() => {
    captureOverlay.removeOverlay();
  }, 1000);
}


console.log('Executing content script');
main();
console.log('Final document', document);
