export function processSuggestion(input: string, suggestion: string): string {
    suggestion = suggestion.trim();
  
    // Remove any introductory phrases more effectively
    suggestion = suggestion.replace(/^(Here is|Here's|This is|Certainly!|Sure!|Okay,).*?[:：]/i, '').trim();
  
    // Remove any part of the suggestion that duplicates the end of the input
    const inputWords = input.trim().split(/\s+/);
    const suggestionWords = suggestion.split(/\s+/);
    
    let overlapIndex = -1;
    for (let i = 0; i < inputWords.length; i++) {
      if (suggestionWords.slice(0, inputWords.length - i).join(' ') === inputWords.slice(i).join(' ')) {
        overlapIndex = inputWords.length - i;
        break;
      }
    }
  
    if (overlapIndex > 0) {
      suggestion = suggestionWords.slice(overlapIndex).join(' ');
    }
  
    // Handle cases based on the last character of the input
    if (input.length > 0 && suggestion.length > 0) {
      const lastCharInput = input[input.length - 1];
      const firstCharSuggestion = suggestion[0];
      
      if (lastCharInput !== ' ' && firstCharSuggestion !== ' ') {
        // If input doesn't end with space and suggestion doesn't start with space, add a space
        suggestion = ' ' + suggestion;
      } else if (lastCharInput === ' ' && firstCharSuggestion === ' ') {
        // If both input ends with space and suggestion starts with space, remove one space
        suggestion = suggestion.slice(1);
      }
    }
  
    // Ensure we keep complete sentences
    const sentences = suggestion.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length > 0) {
      const completeSentences = sentences.join(' ');
      const lastSentenceEnd = suggestion.lastIndexOf(sentences[sentences.length - 1]) + sentences[sentences.length - 1].length;
      const remainingText = suggestion.slice(lastSentenceEnd).trim();
      suggestion = (completeSentences + ' ' + remainingText).trim();
    }

    return suggestion;
}
