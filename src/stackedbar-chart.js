import React, { Fragment } from "react";
import { View } from "react-native";
import { Svg, Image, Rect, G, Text } from "react-native-svg";
import AbstractChart from "./abstract-chart";
import Activity from "./imgs/index";

const barWidth = 16;

class StackedBarChart extends AbstractChart {
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

  getBarRadius = (ret, x) => {
    return this.props.chartConfig.barRadius && ret.length === x.length - 1
      ? this.props.chartConfig.barRadius
      : 0;
  };

  renderBars = config => {
    const {
      data,
      width,
      height,
      paddingTop,
      paddingRight,
      border,
      icons,
      texts,
      onDataPointClick,
      colors
    } = config;

    return data.map((x, i) => {
      // for (let z = 0; z < x.length; z++) {
      //   dataArray.push(x[z])
      // }
      const baseHeight = this.calcBaseHeight([0, 24], height);
      const barWidth = 32 * this.getBarPercentage();
      const ret = [];
      let h = 0;
      let st = paddingTop;
      for (let z = 0; z < x.length; z++) {
        h = (height - 55) * (x[z] / border);
        const y = (height / 4) * 3 - h + st;
        const xC =
          (paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 2) *
          0.7;
        const onPress = () => {
          if (!onDataPointClick) {
            return;
          }

          onDataPointClick({
            index: i,
            value: icons[i][z],
            data,
            x:
              paddingRight +
              (i * (width - paddingRight)) / data.length +
              barWidth / 2,
            y: ((baseHeight - this.calcHeight(x, data, height)) / 4) * 3,
            getColor: opacity => this.getColor(data, opacity)
          });
        };

        // ret.push(
        //   <Rect
        //     key={Math.random()}
        //     x={xC}
        //     y={y}
        //     rx={this.getBarRadius(ret, x)}
        //     ry={this.getBarRadius(ret, x)}
        //     width={barWidth}
        //     height={h}
        //     fill={colors[z]}
        //   />
        // );
        if (!this.props.hideLegend) {
          ret.push(
            <Fragment key={Math.random()}>
              <Image
                x={
                  (paddingRight +
                    (i * (width - paddingRight)) / data.length +
                    barWidth / 2) *
                  0.7
                }
                textAnchor="end"
                y={
                  ((baseHeight - this.calcHeight(x[z], [0, 24], height)) / 4) *
                    3 +
                  0
                }
                width={16}
                height={16}
                href={Activity.image[icons[i][z]]}
                onPress={onPress}
                {...this.getPropsForDots(x, i)}
              />
              <Text
                // key={Math.random()}
                // style={{fontSize: 8}}
                fill="#343649"
                fontSize="6"
                // {...this.getPropsForLabels()}
                x={
                  (paddingRight +
                    (i * (width - paddingRight)) / data.length +
                    barWidth / 2) *
                    0.7 +
                  -3
                }
                textAnchor="center"
                y={
                  ((baseHeight - this.calcHeight(x[z], [0, 24], height)) / 4) *
                    3 +
                  22
                }
                width={16}
                height={16}
              >
                {texts[i][z]}
              </Text>
            </Fragment>
          );
        }

        st -= h;
      }

      return ret;
    });
  };

  renderLegend = config => {
    const { legend, colors, width, height } = config;
    return legend.map((x, i) => {
      return (
        <G key={Math.random()}>
          <Rect
            width="16px"
            height="16px"
            fill={colors[i]}
            rx={8}
            ry={8}
            x={width * 0.71}
            y={height * 0.7 - i * 50}
          />
          <Text
            x={width * 0.78}
            y={height * 0.76 - i * 50}
            {...this.getPropsForLabels()}
          >
            {x}
          </Text>
        </G>
      );
    });
  };

  render() {
    const paddingTop = 15;
    const paddingRight = 50;
    const {
      width,
      height,
      style = {},
      data,
      onDataPointClick,
      withHorizontalLabels = true,
      withVerticalLabels = true
    } = this.props;
    const { borderRadius = 0 } = style;
    const config = {
      width,
      height
    };
    let border = 0;
    for (let i = 0; i < data.data.length; i++) {
      const actual = data.data[i].reduce((pv, cv) => cv, 0);
      if (actual > border) {
        border = actual;
      }
    }

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
            {this.renderHorizontalLines({
              ...config,
              count: 4,
              paddingTop
            })}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  count: 4,
                  data: [0, border],
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
                  paddingRight: paddingRight + 28,
                  stackedBar: true,
                  paddingTop,
                  horizontalOffset: barWidth
                })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.data,
              border,
              colors: this.props.data.barColors,
              paddingTop,
              icons: data.icons,
              texts: data.texts,
              onDataPointClick,
              paddingRight: paddingRight + 20
            })}
          </G>
          {this.renderLegend({
            ...config,
            legend: data.legend,
            colors: this.props.data.barColors
          })}
        </Svg>
      </View>
    );
  }
}
export default StackedBarChart;
