import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import logger from '../../common/utils/logger';

@Injectable()
export class CustomHttpService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Wraps an HTTP GET request with logging and error handling.
   * @param url The URL to request.
   * @param config Optional Axios configuration.
   * @returns The data from the Axios response.
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      logger.debug(`HTTP GET Request: ${url}`);
      const response: AxiosResponse<T> = await firstValueFrom(
        this.httpService.get<T>(url, config),
      );
      logger.debug(`HTTP GET Success: ${url}`);
      return response.data;
    } catch (error) {
      // Log the error details
      logger.error(
        `HTTP GET Error: ${url} - ${error?.message || 'Unknown error'}`,
      );
      // Optionally include error.response data if available
      throw new InternalServerErrorException(
        `Failed to GET from ${url}: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Wraps an HTTP POST request with logging and error handling.
   * @param url The URL to request.
   * @param data The data to post.
   * @param config Optional Axios configuration.
   * @returns The data from the Axios response.
   */
  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      logger.debug(
        `HTTP POST Request: ${url} with data: ${JSON.stringify(data)}`,
      );
      const response: AxiosResponse<T> = await firstValueFrom(
        this.httpService.post<T>(url, data, config),
      );
      logger.debug(`HTTP POST Success: ${url}`);
      return response.data;
    } catch (error) {
      logger.error(
        `HTTP POST Error: ${url} - ${error?.message || 'Unknown error'}`,
      );
      throw new InternalServerErrorException(
        `Failed to POST to ${url}: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  // Additional methods such as put, delete, etc., can be implemented similarly.
}
