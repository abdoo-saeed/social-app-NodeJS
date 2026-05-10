
export const Gender = {
  male: 0,
  female: 1,
} 

export type Gender = (typeof Gender)[keyof typeof Gender];


export const roles = {
  admin: 0,
  user: 1,
} 

export type Role = (typeof roles)[keyof typeof roles];

export const provider = {
  system: 0,
  google: 1,
} 

export type Provider = (typeof provider)[keyof typeof provider];


export const logout = {
  all: "all",
  only: "only",
} 

export type Logout = (typeof logout)[keyof typeof logout];