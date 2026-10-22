import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CompanionAvatar from '../src/components/CompanionAvatar.vue';

describe('CompanionAvatar Component', () => {
  it('renders avatar and origin badge correctly', () => {
    const wrapper = mount(CompanionAvatar, {
      props: {
        avatar: '/companions/astarion.svg',
        name: 'Astarion',
        originType: 'origin',
        size: 'md'
      }
    });

    expect(wrapper.find('img').attributes('src')).toBe('/companions/astarion.svg');
    expect(wrapper.text()).toContain('origin');
  });

  it('renders Tav label for custom originType', () => {
    const wrapper = mount(CompanionAvatar, {
      props: {
        avatar: '/companions/tav.svg',
        name: 'Custom Tav',
        originType: 'custom',
        size: 'lg'
      }
    });

    expect(wrapper.text()).toContain('Tav');
  });
});
