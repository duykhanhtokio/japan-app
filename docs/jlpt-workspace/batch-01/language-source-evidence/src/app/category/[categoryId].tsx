import { useLocalSearchParams } from 'expo-router';

import { FilteredVocabularyList } from '@/components/filtered-vocabulary-list';
import { vocabularyCategories } from '@/data/categories';
import { vocabulary } from '@/data/vocabulary';

export default function CategoryScreen() {
    const { categoryId } = useLocalSearchParams();

    const id = Array.isArray(categoryId)
        ? categoryId[0]
        : categoryId;

    const category = vocabularyCategories.find(
        (item) => item.id === id
    );

    const words = vocabulary.filter(
        (item) =>
            id &&
            item.categoryIds.includes(id)
    );

    if (!category) {
        return null;
    }

    return (
        <FilteredVocabularyList
            typeLabel="カテゴリー"
            title={category.nameJa}
            translation={category.nameVi}
            words={words}
        />
    );
}