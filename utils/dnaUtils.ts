
import { QuestionType } from '../types';

const BASES = ['A', 'T', 'G', 'C'];

export const generateDnaStrand = (length: number): string => {
  let strand = '';
  for (let i = 0; i < length; i++) {
    strand += BASES[Math.floor(Math.random() * BASES.length)];
  }
  return strand;
};

export const getComplementaryStrand = (strand: string): string => {
  return strand.split('').map(base => {
    switch (base.toUpperCase()) {
      case 'A': return 'T';
      case 'T': return 'A';
      case 'G': return 'C';
      case 'C': return 'G';
      default: return '?';
    }
  }).join('');
};

export const getMRNAStrand = (strand: string): string => {
  return strand.split('').map(base => {
    switch (base.toUpperCase()) {
      case 'A': return 'U';
      case 'T': return 'A';
      case 'G': return 'C';
      case 'C': return 'G';
      default: return '?';
    }
  }).join('');
};

export const getCorrectAnswer = (strand: string, questionType: QuestionType): string => {
  return questionType === QuestionType.DNAComplement 
    ? getComplementaryStrand(strand)
    : getMRNAStrand(strand);
};
