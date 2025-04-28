import { TranslationService } from './translation.service';
import { Test } from '@nestjs/testing';

describe('TranslationService', () => {
  let translationService: TranslationService;
  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [TranslationService],
    }).compile();
    translationService = moduleRef.get<TranslationService>(TranslationService);
  });

  it('should translate a string with language exist', () => {
    const input: any = {
      codeMessage: 'ERROR_0001',
      language: 'en',
      params: { user: 'ABC' },
    };
    const translationDataExpected = {
      ERROR_0001: 'User {user} not found',
    };

    jest
      .spyOn(translationService, 'getTranslationData')
      .mockReturnValue(translationDataExpected);

    const result = translationService.translate(input);
    expect(result).toEqual('User ABC not found');
  });
  it('should translate a string with language not exist', () => {
    const input: any = {
      codeMessage: 'ERROR_0001',
      language: 'fr',
      params: { user: 'ABC' },
    };

    const result = translationService.translate(input);
    expect(result).toEqual('');
  });
});
