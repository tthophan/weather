import { Injectable } from '@nestjs/common';
import { TranslationModel } from '../models/translation.model';
import vi from '../locale/vi.json';
import en from '../locale/en.json';

@Injectable()
export class TranslationService {
  translate(data: TranslationModel): string {
    const translationData = this.getTranslationData(data.language);
    if (!translationData) {
      return '';
    }

    let translateMsg = translationData[data.codeMessage];
    if (translationData && !!data.params) {
      for (const [key, value] of Object.entries(data.params)) {
        translateMsg = translateMsg.replaceAll(`{${key}}`, value);
      }
    }
    return translateMsg;
  }

  getTranslationData(language: string): Record<string, string> {
    return {
      vi: vi,
      en: en,
    }[language];
  }
}
