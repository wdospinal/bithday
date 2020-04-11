import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Animated, Easing } from 'react-native';
import image from './res/happy.jpg';
import { Emitter } from 'react-native-particles';
const { width, height } = Dimensions.get('window');


const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time - mins * 60;
    return { mins: formatNumber(mins), secs: formatNumber(secs) };
}

class Main extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      remainingSecs: 0,
      isActive: true,
      secs: 2,
      viewCounter: true,
    }
  }

  componentDidMount() {
    let interval = null;
    const {isActive, remainingSecs} = this.state;
    console.log(isActive)
    if (isActive) {
      interval = setInterval(() => {
        this.setState((state, props) => {
          const newSecs = state.secs - 1;
          const isActive = newSecs === 0;
          if(newSecs === 0) return{...state, viewCounter: false}
          return {...state, secs: newSecs, isActive};
        });
      }, 1000);
    }
  }

  render() {
    const {secs, viewCounter} = this.state;
    return (
      <View style={styles.container}>
        {
          viewCounter ? 
          <Text style={styles.timerText}>{`${secs}`}</Text> :
          <View>
            <Image
                style={styles.image}
                source={image}
              />
              <Emitter
                autoStart={true}
                numberOfParticles={200}
                interval={100}
                emissionRate={10}
                particleLife={10000}
                direction={90}
                spread={120}
                speed={10}
                segments={60}
                width={width}
                height={height}
                fromPosition={() => ({ x: Math.round(Math.random() * width), y: 0 })}
                style={styles.emitter}
                gravity={0.3}
                ref={emitter => (this.emitter = emitter)}
              >
                <Confetti />
            </Emitter>

          </View>
        }
      </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#07121B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width,
    height: height,
  },
  button: {
      borderWidth: 10,
      borderColor: '#B9AAFF',
      width: width / 2,
      height: height / 2,
      borderRadius: width / 2,
      alignItems: 'center',
      justifyContent: 'center'
  },
  buttonText: {
      fontSize: 45,
      color: '#B9AAFF'
  },
  timerText: {
      color: '#fff',
      fontSize: 90,
      marginBottom: 20
  },
  buttonReset: {
      marginTop: 20,
      borderColor: "#FF851B"
  },
  buttonTextReset: {
    color: "#FF851B"
  },
  emitter: {
    position: 'absolute',
    left: 0,
    top: -10,
    bottom: 0,
    right: 0
  },
  confetti: {
    width: 4,
    height: 8,
    backgroundColor: 'red'
  }
});

class Confetti extends React.PureComponent {
  static defaultProps = {
    colors: ['red', 'blue', 'yellow', 'blue']
  };

  constructor(props) {
    super(props);
    const random = Math.random();
    this.duration = Math.max(random * 10000, 5000);
    this.counterClockWise = random > 0.5;
    this.color =
      props.colors[Math.round((random * 10) % (props.colors.length - 1))];
  }

  render() {
    return (
      <Spin duration={this.duration} counterClockWise={this.counterClockWise}>
        <View style={[styles.confetti, { backgroundColor: this.color }]} />
      </Spin>
    );
  }
}

class Spin extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      animatedValue: new Animated.Value(0)
    };
  }
  render() {
    const { children, counterClockWise } = this.props;
    return (
      <Animated.View
        style={{
          transform: [
            {
              rotate: this.state.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: counterClockWise
                  ? ['0deg', '360deg']
                  : ['360deg', '0deg']
              })
            }
          ]
        }}
      >
        {children}
      </Animated.View>
    );
  }

  componentDidMount() {
    const { animatedValue } = this.state;
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: this.props.duration,
          useNativeDriver: true
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true
        })
      ])
    ).start();
  }
}
export default Main;