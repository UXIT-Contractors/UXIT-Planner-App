import React from 'react'
import { api } from '../../../utils/api'
import { Button } from '../../atoms/input/button'

interface AddRequiredStaffingProps {
  RequiredStaffingProps: {
    shift_id: string,
    amountOfStaffRequired: number
    shift_type_id: string
  }
}

export function AddRequiredStaffing({ RequiredStaffingProps }: AddRequiredStaffingProps) {
  const createRequiredStandByStaffing = api.staffRequired.createRequiredStaffing.useMutation()
  const handleAddRequiredStaffing = () => {
    createRequiredStandByStaffing.mutate({
      shift_id: RequiredStaffingProps.shift_id,
      amountOfStaffRequired: RequiredStaffingProps.amountOfStaffRequired,
      shift_type_id: RequiredStaffingProps.shift_type_id
    })
  }

  // TODO
  // Regenerate schedule!!

  return (
    <div>
      <Button
        color="gray"
        className="m-4 text-white"
        onPress={handleAddRequiredStaffing}>
        Reserve toevoegen
      </Button>
    </div>
  )
}

export default AddRequiredStaffing;

