const greet = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let greetingMessage;
  if (currentHour >= 5 && currentHour < 12) {
    greetingMessage = "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greetingMessage = "Good afternoon";
  } else {
    greetingMessage = "Good evening";
  }

  return greetingMessage;
};

export default greet;
