import React from 'react'
import Styled from './styled'

const HelmInput = () => {
  return (
    <Styled.FieldPopover>
      <Styled.Input
        label="Insert a helm repository link"
        name="helmRepository"
        defaultValue="teste"
        // ref={register({ required: true })}
      />
      <Styled.Popover
        title="Helm"
        icon="info"
        size="20px"
        link="https://helm.sh/docs/"
        linkLabel="View documentation"
        description="Helm helps you manage Kubernetes applications"
      />
    </Styled.FieldPopover>

  )
}

export default HelmInput
