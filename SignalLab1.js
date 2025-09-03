  
    let ampSlider, freqSlider, timeSlider, voltSlider, phaseSlider;
    let ampBox, freqBox, timeBox, voltBox, phaseBox;
    let voltSliderFourier, timeSliderFourier, voltBoxFourier, timeBoxFourier;
    let nBox, nSlider, nSliderBox;
    let carrierFreqSlider, carrierFreqBox; // New slider and box for carrier frequency
    
    let waveType = 'sine'; // Track waveform type
    
    let oscOriginal;
    let oscsReconstructed = [];
    let isPlayingOriginal = false;
    let isPlayingReconstructed = false;
    let playOriginalButton, playReconstructedButton;
    
    let marginLeft = 300;
    let col1X = marginLeft;
    let col2X = marginLeft + 500;
    let row1Y = 0;
    let row2Y = 300;
    let winW = 500;
    let winH = 300;
    
    let modZoom = 1;
    let modPanTime = 0;
    
    function setup() {
      createCanvas(1300, 600);
    
      let leftX = 130;   // left margin for labels/sliders
      let boxX = 210;    // x for value boxes
      let startY = 20;   // starting Y for first control
      let stepY = 45;    // vertical spacing between controls
    
      // --- Signal generator buttons ---
      createDiv("Signal").position(47, startY - 5).style("color", "white").style("width", "140px");
      let sineButton = createButton("Sine");
      sineButton.position(20, startY + 15);
      sineButton.size(90, 20);
      sineButton.mousePressed(() => {
        if (isPlayingOriginal) stopOriginal();
        if (isPlayingReconstructed) stopReconstructed();
        waveType = 'sine';
      });
    
      let squareButton = createButton("Square");
      squareButton.position(20, startY + 35);
      squareButton.size(90, 20);
      squareButton.mousePressed(() => {
        if (isPlayingOriginal) stopOriginal();
        if (isPlayingReconstructed) stopReconstructed();
        waveType = 'square';
      });
    
      let sawtoothButton = createButton("Sawtooth");
      sawtoothButton.position(20, startY + 55);
      sawtoothButton.size(90, 20);
      sawtoothButton.mousePressed(() => {
        if (isPlayingOriginal) stopOriginal();
        if (isPlayingReconstructed) stopReconstructed();
        waveType = 'sawtooth';
      });
    
      let triangleButton = createButton("Triangle");
      triangleButton.position(20, startY + 75);
      triangleButton.size(90, 20);
      triangleButton.mousePressed(() => {
        if (isPlayingOriginal) stopOriginal();
        if (isPlayingReconstructed) stopReconstructed();
        waveType = 'triangle';
      });
    
      // --- Play buttons ---
      playOriginalButton = createButton("Play selected Signal");
      playOriginalButton.position(leftX-80, startY + 4 * stepY + 50);
      playOriginalButton.size(200, 20);
      playOriginalButton.mousePressed(toggleOriginal);
      playReconstructedButton = createButton("Play the Reconstructed Signal");
      playReconstructedButton.position(leftX-80, startY + 6 * stepY + 205);
      playReconstructedButton.size(200, 20);
      playReconstructedButton.mousePressed(toggleReconstructed);
    
      // --- Controls ---
      createDiv("Amplitude").position(leftX, startY).style("color", "white").style("width", "90px");
      ampBox = createInput('').attribute("readonly", true);
      ampBox.position(boxX, startY);
      ampBox.size(60);
      ampSlider = createSlider(0, 500, 230, 1);
      ampSlider.size(140);
      ampSlider.position(leftX, startY + 25);
    
      createDiv("Frequency").position(leftX, startY + stepY).style("color", "white").style("width", "90px");
      freqBox = createInput('').attribute("readonly", true);
      freqBox.position(boxX, startY + stepY);
      freqBox.size(60);
      freqSlider = createSlider(0, 1500, 50, 1);
      freqSlider.size(140);
      freqSlider.position(leftX, startY + stepY + 25);
    
      createDiv("Phase Angle").position(leftX, startY + 2 * stepY).style("color", "white").style("width", "110px");
      phaseBox = createInput('').attribute("readonly", true);
      phaseBox.position(boxX, startY + 2 * stepY);
      phaseBox.size(60);
      phaseSlider = createSlider(-180, 180, 0, 1);
      phaseSlider.size(140);
      phaseSlider.position(leftX, startY + 2 * stepY + 25);
    
      createDiv("Amplitude Scale").position(leftX, startY + 3 * stepY).style("color", "white").style("width", "90px");
      voltBox = createInput('').attribute("readonly", true);
      voltBox.position(boxX, startY + 3 * stepY);
      voltBox.size(60);
      voltSlider = createSlider(0, 200, 100, 1);
      voltSlider.size(140);
      voltSlider.position(leftX, startY + 3 * stepY + 25);
    
      createDiv("Time Scale").position(leftX, startY + 4 * stepY).style("color", "white").style("width", "90px");
      timeBox = createInput('').attribute("readonly", true);
      timeBox.position(boxX, startY + 4 * stepY);
      timeBox.size(60);
      timeSlider = createSlider(0, 10, 1, 0.1);
      timeSlider.size(140);
      timeSlider.position(leftX, startY + 4 * stepY + 25);
    
      createDiv("No. of Harmonics considered").position(leftX - 40, startY + 5 * stepY+60).style("color", "white").style("width", "180px");
      nBox = createInput('5');
      nBox.position(leftX+80, startY + 5 * stepY + 80);
      nBox.size(60);
      nSlider = createSlider(1, 1000, 5, 1);
      nSlider.position(leftX - 110+115, startY + 5 * stepY + 95);
      nSlider.size(140);
      nSliderBox = createInput('').attribute("readonly", true);
      nSliderBox.position(boxX, startY + 5 * stepY + 55);
      nSliderBox.size(60);
    
      createDiv("Fourier Amplitude Scale").position(leftX, startY + 6 * stepY+85).style("color", "white").style("width", "110px");
      voltBoxFourier = createInput('').attribute("readonly", true);
      voltBoxFourier.position(boxX, startY + 6 * stepY+82);
      voltBoxFourier.size(60);
      voltSliderFourier = createSlider(0, 200, 100, 1);
      voltSliderFourier.size(140);
      voltSliderFourier.position(leftX, startY + 6 * stepY + 120);
    
      createDiv("Fourier Time Scale").position(leftX-4, startY + 7 * stepY+95).style("color", "white").style("width", "110px");
      timeBoxFourier = createInput('').attribute("readonly", true);
      timeBoxFourier.position(boxX, startY + 7 * stepY+40+55);
      timeBoxFourier.size(60);
      timeSliderFourier = createSlider(0, 10, 1, 0.1);
      timeSliderFourier.size(140);
      timeSliderFourier.position(leftX, startY + 7 * stepY + 130);
    
      // New Carrier Frequency Slider
      createDiv("Carrier Frequency").position(leftX, startY + 8 * stepY+95).style("color", "white").style("width", "110px");
      carrierFreqBox = createInput('').attribute("readonly", true);
      carrierFreqBox.position(boxX, startY + 8 * stepY+95);
      carrierFreqBox.size(60);
      carrierFreqSlider = createSlider(100, 1400, 1000, 10);
      carrierFreqSlider.size(140);
      carrierFreqSlider.position(leftX, startY + 8 * stepY + 120);
    }
    
    function mouseWheel(event) {
      if (mouseX > col2X && mouseX < col2X + winW && mouseY > row1Y && mouseY < row1Y + winH) {
        let f = freqSlider.value();
        let base_T = f === 0 ? 2 : 2 / f;
        let time_span = base_T / modZoom;
        let t_start = modPanTime;
        let mouse_frac = (mouseX - col2X) / winW;
        let mouse_time = t_start + mouse_frac * time_span;
        let factor = event.deltaY > 0 ? 0.9 : 1.1;
        modZoom *= factor;
        modZoom = constrain(modZoom, 0.1, 100);
        let new_time_span = base_T / modZoom;
        modPanTime = mouse_time - mouse_frac * new_time_span;
        return false;
      }
    }
    
    function mouseDragged() {
      if (mouseX > col2X && mouseX < col2X + winW && mouseY > row1Y && mouseY < row1Y + winH) {
        let f = freqSlider.value();
        let base_T = f === 0 ? 2 : 2 / f;
        let time_span = base_T / modZoom;
        let pixel_to_time = time_span / winW;
        modPanTime -= (mouseX - pmouseX) * pixel_to_time;
      }
    }
    
    function toggleOriginal() {
      if (isPlayingOriginal) {
        stopOriginal();
      } else {
        startOriginal();
      }
    }
    
    function startOriginal() {
      let f = freqSlider.value();
      if (f === 0) return; // No sound for DC
    
      let A = ampSlider.value();
      let vol = A / 500.0;
    
      oscOriginal = new p5.Oscillator();
      oscOriginal.setType(waveType);
      oscOriginal.amp(vol);
      oscOriginal.freq(f);
    
      let phase_deg = phaseSlider.value();
      let phase_fraction = ((phase_deg % 360) + 360) % 360 / 360;
      oscOriginal.phase(phase_fraction);
    
      oscOriginal.start();
      isPlayingOriginal = true;
      playOriginalButton.html('Stop Original');
    }
    
    function stopOriginal() {
      if (oscOriginal) {
        oscOriginal.stop();
        oscOriginal = null;
      }
      isPlayingOriginal = false;
      playOriginalButton.html('Play Original');
    }
    
    function toggleReconstructed() {
      if (isPlayingReconstructed) {
        stopReconstructed();
      } else {
        startReconstructed();
      }
    }
    
    function startReconstructed() {
      let f = freqSlider.value();
      if (f === 0) return; // No sound for DC
    
      let A = ampSlider.value();
      let vol_scale = A / 500.0;
    
      let phase_deg = phaseSlider.value();
      let base_phase_fraction = ((phase_deg % 360) + 360) % 360 / 360;
    
      let harmonics = computeHarmonics();
    
      oscsReconstructed = [];
      for (let h of harmonics) {
        let osc = new p5.Oscillator();
        osc.setType('sine');
        let this_vol = vol_scale * h.coeff;
        osc.amp(this_vol);
        osc.freq(h.k * f);
    
        let this_phase = base_phase_fraction;
        if (h.phase_sign < 0) {
          this_phase += 0.5;
          this_phase %= 1;
        }
        osc.phase(this_phase);
    
        osc.start();
        oscsReconstructed.push(osc);
      }
      isPlayingReconstructed = true;
      playReconstructedButton.html('Stop Reconstructed');
    }
    
    function stopReconstructed() {
      for (let osc of oscsReconstructed) {
        osc.stop();
      }
      oscsReconstructed = [];
      isPlayingReconstructed = false;
      playReconstructedButton.html('Play Reconstructed');
    }
    
    function computeHarmonics() {
      let harmonics = [];
      let N = parseInt(nBox.value()) || parseInt(nSlider.value()) || 5;
      N = constrain(N, 1, 1000);
    
      for (let k = 1; k <= N; k++) {
        let coeff = 0;
        let phase_sign = 1;
        if (waveType === 'sine') {
          if (k === 1) coeff = 1;
        } else if (waveType === 'square') {
          if (k % 2 === 1) coeff = 4 / (PI * k);
        } else if (waveType === 'sawtooth') {
          coeff = 2 / (PI * k);
          phase_sign = Math.pow(-1, k + 1);
        } else if (waveType === 'triangle') {
          if (k % 2 === 1) {
            coeff = 8 / (PI * PI * k * k);
            phase_sign = Math.pow(-1, (k - 1) / 2);
          }
        }
        if (coeff !== 0) harmonics.push({k, coeff, phase_sign});
      }
      return harmonics;
    }
    
    function getHarmonicColor(k, N) {
      if (k === 1) return [255, 0, 0]; // Red for fundamental
      colorMode(HSB, 360, 1, 1); // Hue in degrees, Sat/Val normalized
      let hue = ((k - 1) / N) * 360; // Spread hues across N harmonics
      let c = color(hue, 1, 1); // Full saturation and value
      colorMode(RGB, 255); // Switch back to RGB for stroke
      return [red(c), green(c), blue(c)];
    }
    
    function draw() {
      background(0);
    
      // --- Draw bezels/frames ---
      stroke(255, 150, 100);
      strokeWeight(4);
      noFill();
      rect(col1X - 2, row1Y + 2, winW - 1, winH - 4);
      rect(col1X - 2, row2Y + 2, winW - 1, winH - 4);
      rect(col2X - 2, row1Y + 2, winW - 1, winH - 4);
      rect(col2X - 2, row2Y + 2, winW - 1, winH - 4);
    
      // --- Draw CRO grids ---
      push();
      translate(col1X, row1Y);
      drawGrid(winW, winH);
      pop();
      push();
      translate(col1X, row2Y);
      drawGrid(winW, winH);
      pop();
      push();
      translate(col2X, row1Y);
      drawGrid(winW, winH);
      pop();
      push();
      translate(col2X, row2Y);
      drawGrid(winW, winH);
      pop();
    
      let A = ampSlider.value();
      let f = freqSlider.value();
      let t_scale = timeSlider.value();
      let v = voltSlider.value() / 100.0;
      let phi = radians(phaseSlider.value());
    
      const PIX_PER_UNIT_BASE = 70 / 230.0;
      let vScale = PIX_PER_UNIT_BASE * v;
    
      // --- Waveform in left top (Yellow) ---
      push();
      translate(col1X, row1Y);
      let centerY_upper = winH / 2;
      stroke(255, 0, 0);
      strokeWeight(1.5);
      line(0, centerY_upper, winW, centerY_upper);
      stroke(255, 255, 0); // Yellow
      strokeWeight(2);
      noFill();
      beginShape();
      for (let x = 0; x < winW; x++) {
        let cycles = 2 * (f / 50.0) * t_scale;
        let t = cycles * (x / winW) + phi / TWO_PI;
        let y;
        if (f === 0) {
          y = A; // DC case
        } else {
          let waveValue;
          if (waveType === 'sine') {
            waveValue = sin(TWO_PI * cycles * (x / winW) + phi);
          } else if (waveType === 'square') {
            waveValue = Math.sign(sin(TWO_PI * cycles * (x / winW) + phi));
          } else {
            let frac = ((t % 1) + 1) % 1;
            if (waveType === 'sawtooth') {
              waveValue = 2 * (frac - 0.5);
            } else if (waveType === 'triangle') {
              waveValue = frac < 0.5 ? 4 * frac - 1 : 3 - 4 * frac;
            }
          }
          y = A * waveValue;
        }
        vertex(x, centerY_upper - y * vScale);
      }
      endShape();
      pop();
    
      // --- Fourier components in left bottom ---
      push();
      translate(col1X, row2Y);
      let centerY_lower = winH / 2;
      let v_fourier = voltSliderFourier.value() / 100.0;
      let t_fourier = timeSliderFourier.value();
      let vScale_fourier = PIX_PER_UNIT_BASE * v_fourier;
    
      // X-axis for lower
      stroke(255, 0, 0);
      strokeWeight(1.5);
      line(0, centerY_lower, winW, centerY_lower);
    
      let N = parseInt(nBox.value()) || parseInt(nSlider.value()) || 5;
      N = constrain(N, 1, 1000); // Limit to 1000 harmonics
    
      // Compute harmonics based on waveType
      let harmonics = computeHarmonics();
    
      // Plot individual harmonics
      for (let h of harmonics) {
        let [r, g, b] = getHarmonicColor(h.k, N);
        stroke(r, g, b); // Distinct color for each harmonic
        beginShape();
        for (let i = 0; i < winW; i++) {
          let time = (i / winW) * 2 * t_fourier;
          let y_h = A * h.coeff * h.phase_sign * sin(2 * PI * h.k * f * time / 50.0 + phi);
          vertex(i, centerY_lower - y_h * vScale_fourier);
        }
        endShape();
      }
    
      // Plot sum approximation (Yellow)
      stroke(255, 255, 0); // Yellow
      beginShape();
      for (let i = 0; i < winW; i++) {
        let time = (i / winW) * 2 * t_fourier;
        let y_sum = 0;
        for (let h of harmonics) {
          y_sum += A * h.coeff * h.phase_sign * sin(2 * PI * h.k * f * time / 50.0 + phi);
        }
        vertex(i, centerY_lower - y_sum * vScale_fourier);
      }
      endShape();
      pop();
    
      // --- Modulated waveform in right top ---
      push();
      translate(col2X, row1Y);
      let centerY_right_top = winH / 2;
      stroke(255, 0, 0);
      strokeWeight(1.5);
      line(0, centerY_right_top, winW, centerY_right_top);
    
      let f_carrier = carrierFreqSlider.value();
      let base_T = f === 0 ? 2 : 2 / f;
      let time_span = base_T / modZoom;
      let t_start = modPanTime;
      let sampling_rate = 44100; // Hz
      let dt = 1 / sampling_rate; // Time step for 44.1 kHz
    
      stroke(0, 255, 255); // Cyan for modulated wave
      strokeWeight(2);
      noFill();
      beginShape();
      for (let i = 0; i < winW; i++) {
        let t = t_start + (i / winW) * time_span; // Time over displayed span
        let y_sum = 0;
        for (let h of harmonics) {
          y_sum += A * h.coeff * h.phase_sign * sin(2 * PI * h.k * f * t / 50.0 + phi);
        }
        // Normalize y_sum to [-1, 1]
        let m = A === 0 ? 0 : y_sum / A;
        let y_mod = (1 + 0.5 * m) * sin(2 * PI * f_carrier * t); // AM with ratio 0.5
        vertex(i, centerY_right_top - y_mod * 95); // Scale to ~142.5 pixels max
      }
      endShape();
      pop();
    
      // --- Update value boxes ---
      ampBox.value(A + " V");
      freqBox.value(f === 0 ? "DC" : f + " Hz");
      timeBox.value(nf(t_scale, 1, 2) + " ?");
      voltBox.value(nf(v, 1, 2) + " ?");
      phaseBox.value(phaseSlider.value() + "?");
      voltBoxFourier.value(nf(v_fourier, 1, 2) + " ?");
      timeBoxFourier.value(nf(t_fourier, 1, 2) + " ?");
      nBox.value(nSlider.value());
      nSliderBox.value(nSlider.value());
      carrierFreqBox.value(f_carrier + " Hz"); // Update carrier frequency box
    }
    
    function drawGrid(w, h) {
      stroke(0, 150, 0);
      strokeWeight(1);
      for (let x = 0; x < w; x += 20) line(x, 0, x, h);
      for (let y = 0; y < h; y += 20) line(0, y, w, y);
      stroke(0, 255, 0);
      for (let x = 0; x < w; x += 100) line(x, 0, x, h);
      for (let y = 0; y < h; y += 100) line(0, y, w, y);
      stroke(0, 255, 0);
      line(0, h / 2, w, h / 2);
    }
 
    