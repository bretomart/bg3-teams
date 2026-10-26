import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CompanionAvatar from '../src/components/CompanionAvatar.vue';

describe('CompanionAvatar Component', () => {
  it.each([
    ['origin', '/companions/astarion.svg', 'Astarion', 'md', 'origin'],
    ['custom', '/companions/tav.svg', 'Custom Tav', 'lg', 'Tav']
  ])('renders avatar and badge for %s originType', (originType, avatar, name, size, label) => {
    const wrapper = mount(CompanionAvatar, { props: { avatar, name, originType, size } });
    expect(wrapper.find('img').attributes('src')).toBe(avatar);
    expect(wrapper.text()).toContain(label);
  });
});
