

export const haramIngredients = [


    { code: 'E120', name: 'Carmine / Cochineal', status: 'haram', reason: 'Derived from crushed insects' },
    { code: 'E441', name: 'Gelatin', status: 'doubtful', reason: 'Often derived from pork or non-halal slaughtered animals' },
    { code: 'E471', name: 'Mono and Diglycerides', status: 'doubtful', reason: 'Can be animal or plant derived' },
    { code: 'E472', name: 'Esters of Mono/Diglycerides', status: 'doubtful', reason: 'Can be animal or plant derived' },
    { code: 'E473', name: 'Sucrose Esters', status: 'doubtful', reason: 'May contain animal-derived fatty acids' },
    { code: 'E474', name: 'Sucroglycerides', status: 'doubtful', reason: 'May contain animal-derived fatty acids' },
    { code: 'E475', name: 'Polyglycerol Esters', status: 'doubtful', reason: 'Can be animal or plant derived' },
    { code: 'E476', name: 'Polyglycerol Polyricinoleate', status: 'doubtful', reason: 'May involve animal glycerol' },
    { code: 'E481', name: 'Sodium Stearoyl Lactylate', status: 'doubtful', reason: 'Stearic acid may be animal-derived' },
    { code: 'E482', name: 'Calcium Stearoyl Lactylate', status: 'doubtful', reason: 'Stearic acid may be animal-derived' },
    { code: 'E483', name: 'Stearyl Tartrate', status: 'doubtful', reason: 'May be animal-derived' },
    { code: 'E491', name: 'Sorbitan Monostearate', status: 'doubtful', reason: 'Can be animal or plant derived' },
    { code: 'E542', name: 'Bone Phosphate', status: 'haram', reason: 'Derived from animal bones' },
    { code: 'E631', name: 'Disodium Inosinate', status: 'doubtful', reason: 'Can be derived from animal tissue' },
    { code: 'E635', name: 'Disodium Ribonucleotides', status: 'doubtful', reason: 'Can be derived from animal tissue' },
    { code: 'E904', name: 'Shellac', status: 'doubtful', reason: 'Insect secretion (lac bug)' },
    { code: 'E920', name: 'L-Cysteine', status: 'haram', reason: 'Often derived from human hair or duck feathers' },
    { code: 'E921', name: 'L-Cystine', status: 'haram', reason: 'Often derived from human hair' },
    { code: 'E422', name: 'Glycerol/Glycerin', status: 'doubtful', reason: 'Can be animal or plant derived' },



    { code: null, name: 'Gelatin', status: 'doubtful', reason: 'Usually pork or non-halal animal derived' },
    { code: null, name: 'Gelatine', status: 'doubtful', reason: 'Usually pork or non-halal animal derived' },
    { code: null, name: 'Pork', status: 'haram', reason: 'Prohibited in Islam' },
    { code: null, name: 'Lard', status: 'haram', reason: 'Pork fat' },
    { code: null, name: 'Bacon', status: 'haram', reason: 'Pork product' },
    { code: null, name: 'Ham', status: 'haram', reason: 'Pork product' },
    { code: null, name: 'Pepsin', status: 'haram', reason: 'Usually derived from pigs' },
    { code: null, name: 'Rennet', status: 'doubtful', reason: 'Animal enzyme, may be from non-halal source' },
    { code: null, name: 'Alcohol', status: 'haram', reason: 'Intoxicant — prohibited' },
    { code: null, name: 'Ethanol', status: 'haram', reason: 'Drinking alcohol' },
    { code: null, name: 'Wine', status: 'haram', reason: 'Alcoholic beverage' },
    { code: null, name: 'Beer', status: 'haram', reason: 'Alcoholic beverage' },
    { code: null, name: 'Rum', status: 'haram', reason: 'Alcoholic beverage' },
    { code: null, name: 'Whey', status: 'doubtful', reason: 'May use non-halal rennet in cheese production' },
    { code: null, name: 'Carmine', status: 'haram', reason: 'Insect-derived colorant' },
    { code: null, name: 'Cochineal', status: 'haram', reason: 'Insect-derived colorant' },
    { code: null, name: 'Tallow', status: 'doubtful', reason: 'Animal fat — needs halal certification' },
    { code: null, name: 'Stearic Acid', status: 'doubtful', reason: 'Can be animal or plant derived' },
    { code: null, name: 'Lipase', status: 'doubtful', reason: 'Enzyme possibly from animal source' },
    { code: null, name: 'Vanilla Extract', status: 'doubtful', reason: 'May contain alcohol as solvent' },
    { code: null, name: 'Mono-glycerides', status: 'doubtful', reason: 'Can be animal derived' },
    { code: null, name: 'Diglycerides', status: 'doubtful', reason: 'Can be animal derived' },
    { code: null, name: 'L-Cysteine', status: 'haram', reason: 'Often from human hair or duck feathers' },
    { code: null, name: 'Shortening', status: 'doubtful', reason: 'May contain animal fats' },
    { code: null, name: 'Emulsifier', status: 'doubtful', reason: 'Generic — check specific type' },
];



export function analyzeIngredients(text) {
    const normalizedText = text.toLowerCase();
    const found = [];
    const safe = [];



    const words = normalizedText.split(/[\s,;.()\[\]\/]+/).filter(w => w.length > 1);
    const fullText = normalizedText;

    for (const ingredient of haramIngredients) {
        const nameMatch = ingredient.name.toLowerCase();
        const codeMatch = ingredient.code ? ingredient.code.toLowerCase() : null;

        if (fullText.includes(nameMatch) || (codeMatch && fullText.includes(codeMatch))) {
            found.push(ingredient);
        }
    }



    const safeKeywords = [
        'sugar', 'salt', 'water', 'flour', 'wheat', 'rice', 'corn', 'soy',
        'vegetable oil', 'sunflower', 'palm oil', 'olive', 'cocoa', 'milk',
        'butter', 'cream', 'yeast', 'baking', 'citric acid', 'vinegar',
        'starch', 'potato', 'tomato', 'onion', 'garlic', 'pepper', 'spice',
        'lecithin', 'pectin', 'agar', 'carrageenan', 'guar gum', 'xanthan',
    ];

    for (const kw of safeKeywords) {
        if (fullText.includes(kw)) {
            safe.push({ name: kw.charAt(0).toUpperCase() + kw.slice(1), status: 'safe', reason: 'Common halal ingredient' });
        }
    }

    return { flagged: found, safe, totalFound: found.length + safe.length };
}

