/**
 * MultiLanguageTranslation.ts
 *
 * Multi language translation handling
 *
 * NB For now, tranlations use {<id>} to embed translated data.
 * e.g 'TEXT_GREETING' = "Hi {name} how are you today?" can be translated as
 * GetTranslation('TEXT_GREETING', {name: 'bob'}) and decode to
 * Hi bob how are you today?
 */
export class MultiLanguageTranslation {
    constructor() {
        this.translationTables = [];
    }
    /**
     * AddTable
     *
     * Add a translation table
     */
    AddTable(ID, table) {
        if (this.translationTables.findIndex((existing) => {
            return existing.tableID === ID;
        }) !== -1) {
            //Refuse same name
            console.log('Translation table ' +
                ID +
                ' add attempt when it already exists, ignoring');
            return;
        }
        this.translationTables.push({ tableID: ID, translations: table });
    }
    /**
     * GetTranslation
     *
     * Get a translation
     */
    GetTranslation(textID, decode) {
        //Try to find the text in the tables, if not there report the ID
        for (let i = 0; i < this.translationTables.length; i++) {
            const table = this.translationTables[i];
            if (table.translations[textID] !== undefined) {
                if (decode !== undefined) {
                    return this.DecodeTranslation(table.translations[textID].translation, decode);
                }
                return table.translations[textID].translation;
            }
        }
        //Failed, report the original requested ID
        return textID;
    }
    /**
     * DecodeTranslation
     *
     * Apply decode to a text string
     *
     *
     */
    DecodeTranslation(text, decode) {
        //Find all decodable blocks and convert them
        let resultText = text.replace(/{(.*?)}/g, (match, index) => decode[index]);
        //Report the result
        return resultText;
    }
}
//# sourceMappingURL=MultiLanguageTranslation.js.map