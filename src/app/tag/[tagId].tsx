import { useLocalSearchParams } from 'expo-router';

import { FilteredVocabularyList } from '@/components/filtered-vocabulary-list';
import { vocabularyTags } from '@/data/tags';
import { vocabulary } from '@/data/vocabulary';

export default function TagScreen() {
    const { tagId } = useLocalSearchParams();

    const id = Array.isArray(tagId)
        ? tagId[0]
        : tagId;

    const tag = vocabularyTags.find(
        (item) => item.id === id
    );

    const words = vocabulary.filter(
        (item) =>
            id &&
            item.tagIds.includes(id)
    );

    if (!tag) {
        return null;
    }

    return (
        <FilteredVocabularyList
            typeLabel="タグ"
            title={tag.nameJa}
            translation={tag.nameVi}
            words={words}
        />
    );
}