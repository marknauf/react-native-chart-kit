import React from "react";
import { View } from "react-native";
import { Svg, Rect, G, Image } from "react-native-svg";
import AbstractChart from "@marknauf/react-native-chart-kit/src/abstract-chart";
import Activity from "@marknauf/react-native-chart-kit/src/imgs";

const barWidth = 32;

class MoodChart extends AbstractChart {
  getColor = (dataset, opacity) => {
    return (dataset.color || this.props.chartConfig.color)(opacity);
  };

  getBarPercentage = () => {
    const { barPercentage = 1 } = this.props.chartConfig;
    return barPercentage;
  };

  getPropsForDots = (x, i) => {
    const { getDotProps, chartConfig = {} } = this.props;
    if (typeof getDotProps === "function") {
      return getDotProps(x, i);
    }
    const { propsForDots = {} } = chartConfig;
    return { r: "4", ...propsForDots };
  };

  renderBars = config => {
    const { data, width, height, paddingTop, paddingRight } = config;
    const baseHeight = this.calcBaseHeight(data, height);
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = 32 * this.getBarPercentage();
      return (
        <Rect
          key={Math.random()}
          x={
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 2
          }
          y={((baseHeight - this.calcHeight(x, data, height)) / 4) * 3}
          width={barWidth}
          height={(Math.abs(barHeight) / 4) * 3}
          fill="url(#fillShadowGradient)"
        />
      );
    });
  };

  renderBarTops = config => {
    const {
      data,
      width,
      height,
      paddingTop,
      paddingRight,
      icons,
      onDataPointClick
    } = config;
    const baseHeight = this.calcBaseHeight(data, height);
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = 32 * this.getBarPercentage();
      const onPress = () => {
        if (!onDataPointClick) {
          return;
        }

        onDataPointClick({
          index: i,
          value: icons[i],
          data,
          x:
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 2,
          y: ((baseHeight - this.calcHeight(x, data, height)) / 4) * 3,
          getColor: opacity => this.getColor(data, opacity)
        });
      };

      return (
        <Image
          key={Math.random()}
          x={
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 2
          }
          y={((baseHeight - this.calcHeight(x, data, height)) / 4) * 3}
          width={40}
          height={40}
          href={Activity.image[icons[i]]}
          onPress={onPress}
          {...this.getPropsForDots(x, i)}
        />
      );
    });
  };

  render() {
    const {
      width,
      height,
      onDataPointClick,
      data,
      style = {},
      withHorizontalLabels = true,
      withVerticalLabels = true,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      withInnerLines = true,
      segments = 4
    } = this.props;
    const { borderRadius = 0, paddingTop = 16, paddingRight = 16 } = style;
    const config = {
      width,
      height,
      verticalLabelRotation,
      horizontalLabelRotation
    };
    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs({
            ...config,
            ...this.props.chartConfig
          })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {withInnerLines
              ? this.renderHorizontalLines({
                  ...config,
                  count: segments,
                  paddingTop
                })
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  count: segments,
                  data: data.datasets[0].data,
                  paddingTop,
                  paddingRight
                })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels({
                  ...config,
                  labels: data.labels,
                  paddingRight,
                  paddingTop,
                  horizontalOffset: barWidth * this.getBarPercentage()
                })
              : null}
          </G>
          {/* <G>
            {this.renderBars({
              ...config,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight
            })}
          </G> */}
          <G>
            {this.renderBarTops({
              ...config,
              data: data.datasets[0].data,
              icons: data.icons,
              onDataPointClick,
              paddingTop,
              paddingRight
            })}
          </G>
        </Svg>
      </View>
    );
  }
}

export default MoodChart;
