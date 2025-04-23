import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getFileTypeIcon(fileName: string): {
  icon: string;
  bgColor: string;
  iconColor: string;
} {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (['pdf'].includes(extension)) {
    return {
      icon: 'ri-file-pdf-line',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary'
    };
  } else if (['doc', 'docx'].includes(extension)) {
    return {
      icon: 'ri-file-word-line',
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary'
    };
  } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
    return {
      icon: 'ri-image-line',
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent'
    };
  }
  
  return {
    icon: 'ri-file-line',
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-600'
  };
}

export function getMockResponse(question: string): string {
  const mockResponses: Record<string, string> = {
    'loan amount': 'Based on the Loan_Application.pdf, the requested loan amount is <span class="font-medium text-primary">AED 250,000</span>. This is specified in section 3.1 of the application form under "Requested Financing Amount".',
    'annual income': 'According to the Financial_Statement.docx, the applicant\'s annual income is <span class="font-medium text-primary">AED 420,000</span>, which includes a base salary of AED 360,000 and annual bonuses averaging AED 60,000. This information can be found on page 2 of the statement under "Income Summary".',
    'passport': 'The Passport_Scan.jpg shows that the passport was issued on <span class="font-medium text-primary">March 15, 2019</span> and is valid until March 14, 2029. The passport number is P12345678.',
    'address': 'The applicant\'s registered address is <span class="font-medium text-primary">Villa 42, Street 11, Al Wasl, Dubai, UAE</span> as mentioned in both the Loan_Application.pdf and Financial_Statement.docx.',
    'employment': 'The applicant is employed at <span class="font-medium text-primary">Global Tech Solutions LLC</span> as a Senior Project Manager since January 2018, as stated in the Loan_Application.pdf.',
    'default': 'I\'ve analyzed the documents, but I don\'t have specific information about that query. Could you please rephrase or ask about loan details, income, personal information, or employment status?'
  };

  const lowercaseQuestion = question.toLowerCase();
  
  for (const [keyword, response] of Object.entries(mockResponses)) {
    if (lowercaseQuestion.includes(keyword)) {
      return response;
    }
  }
  
  return mockResponses.default;
}
