import { UpdateUserInput, UpdatePhotoInput } from './user.schema';
import * as userRepository from './user.repository';

export const getAllUsers = async (page: number, limit: number) => {
  return userRepository.findAllUsers(page, limit);
};

export const getUserById = async (id: string) => {
  return userRepository.findUserById(id);
};

export const updateUser = async (id: string, input: UpdateUserInput) => {
  return userRepository.updateUserById(id, input);
};

export const deleteUser = async (id: string): Promise<boolean> => {
  return userRepository.deleteUserById(id);
};

export const updateProfilePhoto = async (id: string, input: UpdatePhotoInput) => {
  return userRepository.updateProfilePhotoById(id, input);
};
