/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from "react"
import type { AriaListBoxOptions } from "@react-aria/listbox"
import type { ListState } from "react-stately"
import type { Node } from "@react-types/shared"
import { useListBox, useListBoxSection, useOption } from "react-aria"

interface ListBoxProps extends AriaListBoxOptions<unknown> {
  listBoxRef?: React.RefObject<HTMLUListElement>
  state: ListState<unknown>
}

interface SectionProps {
  section: Node<unknown>
  state: ListState<unknown>
}

interface OptionProps {
  item: Node<unknown>
  state: ListState<unknown>
}

export function ListBox(props: ListBoxProps) {
  const ref = React.useRef<HTMLUListElement>(null)
  const { listBoxRef = ref, state } = props
  const { listBoxProps } = useListBox(props, state, listBoxRef)

  return (
    <ul
      {...listBoxProps}
      ref={listBoxRef}
      className="w-full overflow-auto outline-none max-h-72"
    >
      {[...state.collection].map((item) =>
        item.type === "section" ? (
          <ListBoxSection key={item.key} section={item} state={state} />
        ) : (
          <Option key={item.key} item={item} state={state} />
        )
      )}
    </ul>
  )
}

function ListBoxSection({ section, state }: SectionProps) {
  const { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    "aria-label": section["aria-label"]
  })

  return (
    <>
      <li {...itemProps} className="pt-2">
        {section.rendered && (
          <span
            {...headingProps}
            className="mx-3 text-xs font-bold text-gray-500 uppercase"
          >
            {section.rendered}
          </span>
        )}
        <ul {...groupProps}>
          {[...section.childNodes].map((node) => (
            <Option key={node.key} item={node} state={state} />
          ))}
        </ul>
      </li>
    </>
  )
}

function Option({ item, state }: OptionProps) {
  const ref = React.useRef<HTMLLIElement>(null)
  const { optionProps, isDisabled, isSelected, isFocused } = useOption(
    {
      key: item.key
    },
    state,
    ref
  )

  let text = "text-gray-700 dark:text-white"
  if (isFocused || isSelected) {
    text = "ring-2 ring-yellow-500 text-black"
  } else if (isDisabled) {
    text = "text-gray-200 dark:text-white"
  }

  return (
    <li
      {...optionProps}
      ref={ref}
      className={`m-1 rounded-sm py-2 px-2 text-sm outline-none cursor-pointer flex items-center justify-between ${text} ${isFocused ? "bg-yellow-100" : ""
        } ${isSelected ? "font-bold dark:text-white focus:text-black" : ""}`}
    >
      {item.rendered}
    </li>
  )
}
