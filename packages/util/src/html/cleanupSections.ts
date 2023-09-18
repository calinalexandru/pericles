import getSelfIframes from './getSelfIframes';
import removeHelperTags from './removeHelperTags';
import sectionQuerySelector from './sectionQuerySelector';

export default function cleanupSections(sectionKey: number): void {
  const nodesInFrame: HTMLElement[] = getSelfIframes().reduce(
    (acc, iframe) => [
      ...acc,
      ...Array.from(
        iframe.document.querySelectorAll<HTMLElement>(
          sectionQuerySelector(sectionKey)
        )
      ),
    ],
    [] as HTMLElement[]
  );
  removeHelperTags(
    Array.from(
      document.querySelectorAll<HTMLElement>(sectionQuerySelector(sectionKey))
    )
  );
  if (nodesInFrame.length) removeHelperTags(nodesInFrame);
}
