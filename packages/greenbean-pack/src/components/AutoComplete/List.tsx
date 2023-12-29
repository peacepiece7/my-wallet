import styled from 'styled-components'
import { AutoCompleteItem, AutoCompleteProps } from '../AutoComplete'

interface ListProps<T extends AutoCompleteItem> {
  items?: T[]
  open: boolean
  isLoading?: boolean
  renderListOptions: AutoCompleteProps<T>['renderListOptions']
  renderListIsLoading?: AutoCompleteProps<T>['renderListIsLoading']
  onMounseDown: (item: T) => void
}

export function AutoCompleteList<T extends AutoCompleteItem>({
  items,
  open,
  isLoading,
  renderListOptions,
  renderListIsLoading,
  onMounseDown
}: ListProps<T>) {
  const handleOnClick = (item: T) => {
    onMounseDown(item)
  }
  if (isLoading)
    return (
      <List $open={open}>
        <ListItem $open={open}>{renderListIsLoading ? renderListIsLoading() : 'Loading...'}</ListItem>
      </List>
    )

  if (!items || !items.length) return null

  return (
    <List $open={open}>
      {items.map((item) => {
        return (
          <ListItem key={item.id} $open={open} onMouseDown={() => handleOnClick({ ...item, test: false })}>
            {renderListOptions(item, !!item.selected)}
          </ListItem>
        )
      })}
    </List>
  )
}

const List = styled.ul<{ $open: boolean }>`
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  margin: auto;
  border: ${({ $open }) => ($open ? '1px solid black' : 'none')};
`

const ListItem = styled.li<{ $open: boolean }>`
  width: 100%;
  height: ${({ $open }) => ($open ? '2rem' : '0px')};
  z-index: 1;
  overflow: hidden;
  transition: height 0.2s ease-in-out;
`