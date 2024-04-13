import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import moment from "moment";

function CustomTimer({ interval, style }) {
  const pad = (n) => (n < 10 ? "0" + n : n);
  const duration = moment.duration(interval);
  const hundredths = Math.floor(duration.milliseconds() / 10);
  return (
    <View style={styles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:</Text>
      <Text style={style}>{pad(duration.seconds())},</Text>
      <Text style={style}>{pad(hundredths)}</Text>
    </View>
  );
}

function CustomRoundButton({ title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress()}
      style={[styles.button, { backgroundColor: background }]}
      activeOpacity={disabled ? 1.0 : 0.7}
    >
      <View style={styles.buttonBorder}>
        <Text style={[styles.buttonTitle, { color }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

function CustomLap({ number, interval, fastest, slowest }) {
  const lapStyle = [
    styles.lapText,
    fastest && styles.fastest,
    slowest && styles.slowest,
  ];
  return (
    <View style={styles.lap}>
      <Text style={lapStyle}>Custom Lap {number}</Text>
      <CustomTimer style={[lapStyle, styles.lapTimer]} interval={interval} />
    </View>
  );
}

function CustomLapsTable({ laps, timer }) {
  const finishedLaps = laps.slice(1);
  const min = Math.min(...finishedLaps);
  const max = Math.max(...finishedLaps);
  return (
    <ScrollView style={styles.scrollView}>
      {laps.map((lap, index) => (
        <CustomLap
          number={laps.length - index}
          key={laps.length - index}
          interval={index === 0 ? timer + lap : lap}
          fastest={lap === min}
          slowest={lap === max}
        />
      ))}
    </ScrollView>
  );
}

function CustomButtonsRow({ children }) {
  return <View style={styles.buttonsRow}>{children}</View>;
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      now: 0,
      laps: [],
      timer: null,
    };
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  startTimer = () => {
    const timer = setInterval(() => {
      this.setState((prevState) => ({
        now: new Date().getTime(),
      }));
    }, 100);
    this.setState({
      start: new Date().getTime(),
      now: new Date().getTime(),
      laps: [0],
      timer,
    });
  };

  pauseTimer = () => {
    clearInterval(this.state.timer);
    const { laps, now, start } = this.state;
    const [firstLap, ...other] = laps;
    this.setState({
      laps: [firstLap + now - start, ...other],
      start: 0,
      now: 0,
      timer: null,
    });
  };

  snapshot = () => {
    const timestamp = new Date().getTime();
    const { laps, now, start } = this.state;
    const [firstLap, ...other] = laps;
    this.setState({
      laps: [0, firstLap + now - start, ...other],
      start: timestamp,
      now: timestamp,
    });
  };

  continueTimer = () => {
    const timer = setInterval(() => {
      this.setState((prevState) => ({
        now: new Date().getTime(),
      }));
    }, 100);
    this.setState({
      start: new Date().getTime(),
      now: new Date().getTime(),
      timer,
    });
  };

  resetTimer = () => {
    clearInterval(this.state.timer);
    this.setState({
      laps: [],
      start: 0,
      now: 0,
      timer: null,
    });
  };

  render() {
    const { now, start, laps } = this.state;
    const timer = now - start;
    return (
      <View style={styles.container}>
        <CustomTimer
          interval={laps.reduce((total, curr) => total + curr, 0) + timer}
          style={styles.timer}
        />
        {laps.length === 0 && (
          <CustomButtonsRow>
            <CustomRoundButton
              title="Lap"
              color="#8B8B90"
              background="#151515"
              disabled
            />
            <CustomRoundButton
              title="Start"
              color="#50D167"
              background="#1B361F"
              onPress={this.startTimer}
            />
          </CustomButtonsRow>
        )}
        {start > 0 && (
          <CustomButtonsRow>
            <CustomRoundButton
              title="Lap"
              color="#FFFFFF"
              background="#3D3D3D"
              onPress={this.snapshot}
            />
            <CustomRoundButton
              title="Stop"
              color="#E33935"
              background="#3C1715"
              onPress={this.pauseTimer}
            />
          </CustomButtonsRow>
        )}
        {laps.length > 0 && start === 0 && (
          <CustomButtonsRow>
            <CustomRoundButton
              title="Reset"
              color="#FFFFFF"
              background="#3D3D3D"
              onPress={this.resetTimer}
            />
            <CustomRoundButton
              title="Start"
              color="#50D167"
              background="#1B361F"
              onPress={this.continueTimer}
            />
          </CustomButtonsRow>
        )}
        <CustomLapsTable laps={laps} timer={timer} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
    paddingTop: 130,
    paddingHorizontal: 20,
  },
  timer: {
    color: "#FFFFFF",
    fontSize: 76,
    fontWeight: "200",
    width: 110,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTitle: {
    fontSize: 18,
  },
  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginTop: 80,
    marginBottom: 30,
  },
  lapText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  lapTimer: {
    width: 30,
  },
  lap: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#151515",
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  scrollView: {
    alignSelf: "stretch",
  },
  fastest: {
    color: "#4BC05F",
  },
  slowest: {
    color: "#CC3531",
  },
  timerContainer: {
    flexDirection: "row",
  },
});
