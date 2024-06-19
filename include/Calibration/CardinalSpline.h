#pragma once

#include <vector>

class CardinalSpline {
 public:
  CardinalSpline(const std::vector<float>& x, const std::vector<float>& y,
                 float tension);
  float interpolate(float x) const;

 private:
  std::vector<float> _x;
  std::vector<float> _y;
  float _tension;

  static constexpr float MIN_TENSION = 0.0f;
  static constexpr float MAX_TENSION = 1.0f;
};