export const customStyles = (style) => {
  const {
    fs: fontSize,
    c: color,
    fw: fontFamily,
    m: margin,
    h: height,
    w: width,
    br: borderRadius,
    bg: backgroundColor,
    dply: display,
    jc: justifyContent,
    b: border,
    bs: boxShadow,
    p: padding,
    pt: paddingTop,
  } = style;
  return {
    fontSize,
    color,
    fontFamily,
    margin,
    height,
    width,
    borderRadius,
    backgroundColor,
    display,
    justifyContent,
    border,
    boxShadow,
    padding,
    paddingTop,
  };
};

export const filterKeys = (mainObject, objectToFilter) => {
  const filteredObject = {};

  for (const key in mainObject) {
    if (objectToFilter.hasOwnProperty(key)) {
      filteredObject[key] = objectToFilter[key];
    }
  }

  return filteredObject;
};
