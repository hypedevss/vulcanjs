export default function search(word: string, search: string): string | null {
    const lowerCaseWord = word.toLowerCase();
    const lowerCaseSearch = search.toLowerCase();

    if (lowerCaseWord.includes(lowerCaseSearch)) {
        return word;
    } else {
        return null;
    }
}