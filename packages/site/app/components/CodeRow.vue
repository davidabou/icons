<template>
  <!--
    Wrapped code is top-aligned with the button: a 20px line with 10px padding is as tall as the
    40px button, so the first line stays centered on it however many lines follow.
  -->
  <div :class="cn('flex gap-2 rounded-3xl bg-muted py-1.5 pr-1.5 pl-3.5', wrap ? 'items-start' : 'items-center', $attrs.class as string)">
    <code
      class="flex-1 font-mono text-[13px]"
      :class="wrap ? 'py-2.5 leading-5 break-words whitespace-pre-wrap' : 'overflow-x-auto whitespace-nowrap'"
    >{{ code }}</code>
    <Tooltip>
      <TooltipTrigger>
        <CopyButton
          :content="code"
          :class="cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }), 'text-muted-foreground')"
          :aria-label="`Copy ${label}`"
          @copied-change="(copied: boolean) => copied && play('success')"
        >
          <CopyButtonIcon>
            <template #icon>
              <DaIcon name="IconCopy" :size="20" />
            </template>
            <template #copied-icon>
              <DaIcon name="IconCheck" :size="20" />
            </template>
          </CopyButtonIcon>
        </CopyButton>
      </TooltipTrigger>
      <TooltipContent>Copy</TooltipContent>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { CopyButton, CopyButtonIcon } from '@animate-ui/vue/primitives/buttons/copy';
import { cn } from 'cn';
import { buttonVariants } from '~/components/ui/button';

defineOptions({ inheritAttrs: false });

const { play } = useSound();

defineProps<{
  /** Code to show and copy */
  code: string;
  /** What the code is, for the button label */
  label: string;
  /** Wrap long lines instead of scrolling */
  wrap?: boolean;
}>();
</script>
