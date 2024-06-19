// CardinalSpline.cpp
#include "Calibration/CardinalSpline.h"

#include <cmath>

CardinalSpline::CardinalSpline(const std::vector<float>& x,
                               const std::vector<float>& y, float tension)
    : _x(x), _y(y) {
  // Clamp tension to the valid range [MIN_TENSION, MAX_TENSION]
  _tension = std::max(MIN_TENSION, std::min(tension, MAX_TENSION));
}

float CardinalSpline::interpolate(float x) const {
  if (_x.empty() || _y.empty() || _x.size() != _y.size()) {
    return 0.0f;
  }

  if (x <= _x.front()) {
    return _y.front();
  }

  if (x >= _x.back()) {
    return _y.back();
  }

  size_t i = 0;
  while (i < _x.size() - 1 && _x[i + 1] < x) {
    ++i;
  }

  float h = _x[i + 1] - _x[i];
  float t = (x - _x[i]) / h;

  float y0 = _y[i];
  float y1 = _y[i + 1];
  float y0d = 0.0f;
  float y1d = 0.0f;

  if (i > 0) {
    y0d = (_y[i + 1] - _y[i - 1]) / (_x[i + 1] - _x[i - 1]);
  }
  if (i < _x.size() - 2) {
    y1d = (_y[i + 2] - _y[i]) / (_x[i + 2] - _x[i]);
  }

  float a = 2.0f * (y0 - y1) + h * (y0d + y1d);
  float b = -3.0f * (y0 - y1) - h * (2.0f * y0d + y1d);
  float c = y0d * h;
  float d = y0;

  float t2 = t * t;
  float t3 = t2 * t;

  return a * t3 + b * t2 + c * t + d;
}