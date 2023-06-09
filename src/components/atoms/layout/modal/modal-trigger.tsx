import { useOverlayTrigger } from 'react-aria'
import { type OverlayTriggerProps, useOverlayTriggerState } from 'react-stately'

// Reuse the Button from your component library. See below for details.
import { Button } from '../../input'
import { Modal } from './modal'
import React from 'react'

export function ModalTrigger({ children, ...props }: { children: (close: () => void) => React.ReactElement } & OverlayTriggerProps) {
  const state = useOverlayTriggerState(props)
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state
  )

  return (
    <>
      <Button {...triggerProps}>Open Dialog</Button>
      {state.isOpen &&
        (
          <Modal {...props} state={state}>
            {React.cloneElement(children(() => { state.close() }), overlayProps)}
          </Modal>
        )}
    </>
  )
}
