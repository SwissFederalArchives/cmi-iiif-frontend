import React, { useContext, useEffect } from 'react';
import i18next from 'i18next';
import { use100vh } from 'react-div-100vh';
import clsx from 'clsx';
import { styled, Box } from '@mui/system';
import { Modal, ModalProps } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { AppContext } from '../AppContext';

const BackdropUnstyled = React.forwardRef<HTMLDivElement, { open?: boolean; className: string }>((props, ref) => {
  const { open, className, ...other } = props;
  return <div className={clsx({ 'MuiBackdrop-open': open }, className)} ref={ref} {...other} />;
});

const CloseButton = styled('button')({
  position: 'absolute',
  top: '-2.25em',
  right: '-0.75em',
  color: 'white',
  fontSize: '13px',
  border: 0,
  outline: 0,
  background: 'none',
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  '> span': {
    marginRight: '0.5em',
  },
});

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: 0;
`;

const Backdrop = styled(BackdropUnstyled)`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.59);
  -webkit-tap-highlight-color: transparent;
  outline: 0 !important;
  backdrop-filter: blur(3px);
`;

const style = (viewportHeight: number | null) => ({
  position: 'relative',
  width: 'calc(100vw - 50px)',
  height: `calc(${viewportHeight + 'px' || '100vh'} - 75px)`,
  bgcolor: 'black',
});

export default function ViewerModal(props: Omit<ModalProps, 'open'>) {
  const { lastItemActivationDate } = useContext(AppContext);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const { children } = props;

  const viewportHeight = use100vh();

  useEffect(() => {
    setOpen(true);
  }, [lastItemActivationDate]);

  return children ? (
    <StyledModal
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={open}
      onClose={handleClose}
      slots={{ backdrop: Backdrop }}
    >
      <Box sx={style(viewportHeight)}>
        <>
          <CloseButton onClick={handleClose}>
            <span>
              <>{i18next.t('common:close')}</>
            </span>
            <CancelIcon />
          </CloseButton>
          {children}
        </>
      </Box>
    </StyledModal>
  ) : null;
}
