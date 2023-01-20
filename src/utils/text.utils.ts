export const clampMiddle = (str: string, edgeLength = 6, rightEdgeLength = edgeLength) =>
  `${str.substring(0, edgeLength)}...${str.substring(str.length - rightEdgeLength)}`;

export const capitalize = (str: string) => str.replace(/^./, (s) => s.toUpperCase());

export const removeExtraSpaces = (str: string) => str.trim().replace(/\s\s+/g, ' ');

export const isOverflow = <T extends HTMLElement>(element: T) => element.offsetWidth < element.scrollWidth;
