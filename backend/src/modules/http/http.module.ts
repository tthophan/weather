import { Global, Module } from '@nestjs/common';
import {
  ExternalHttpClientService,
  InternalHttpClientService,
} from './services';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [InternalHttpClientService, ExternalHttpClientService],
  exports: [InternalHttpClientService, ExternalHttpClientService],
})
export class HttpModule {}
