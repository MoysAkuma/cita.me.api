import { CreateAppointmentInput, UpdateAppointmentInput, UpdateStatusInput, CreateConfirmacionInput } from './appointment.schema';
import * as appointmentRepository from './appointment.repository';

export const getCitas = async (page: number, limit: number, filters: { usuarioId?: string; proveedorId?: string }) => {
  return appointmentRepository.findCitas(page, limit, filters);
};

export const getCitaById = async (id: string) => {
  return appointmentRepository.findCitaById(id);
};

export const createCita = async (usuarioId: string, input: CreateAppointmentInput) => {
  return appointmentRepository.insertCita(usuarioId, input);
};

export const updateCita = async (id: string, input: UpdateAppointmentInput) => {
  return appointmentRepository.updateCitaById(id, input);
};

export const updateCitaStatus = async (id: string, input: UpdateStatusInput) => {
  return appointmentRepository.updateCitaStatusById(id, input);
};

export const deleteCita = async (id: string): Promise<boolean> => {
  return appointmentRepository.deleteCitaById(id);
};

export const getConfirmaciones = async (citaId: string) => {
  return appointmentRepository.findConfirmaciones(citaId);
};

export const createConfirmacion = async (citaId: string, input: CreateConfirmacionInput) => {
  return appointmentRepository.insertConfirmacion(citaId, input);
};
