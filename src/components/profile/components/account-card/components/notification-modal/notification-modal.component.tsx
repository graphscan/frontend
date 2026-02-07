import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Web3AlertLogo } from "./notification-modal.icons";
import { Link, Modal, Redirect } from "./notification-modal.styled";
import { Form, FormProps } from "./components/form/form.component";
import { getEnvVariables } from "../../../../../../utils/env.utils";
import { preventDefault } from "../../../../../../utils/events.utils";

type Props = {
  isVisible: boolean;
  onCancel: () => void;
} & FormProps;

export const NotificationModal: React.FC<Props> = ({
  id,
  isDelegator,
  isIndexer,
  isVisible,
  onCancel,
}) => {
  const { web3AlertUrl } = getEnvVariables();

  const [isValid, setIsValid] = useState(false);
  const [redirectOptions, setRedirectOptions] = useState("");

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  useEffect(() => {
    return () => handleCancel();
  }, [handleCancel]);

  return (
    <Modal
      isVisible={isVisible}
      onCancel={handleCancel}
      title={
        <>
          <div>Get notifications to your messengers</div>
          <div className="modal-description">
            It's simple and free.{" "}
            <Link
              href="https://youtu.be/tbRDDasPIDs?si=5k-16PWxJqfUkE30"
              target="_blank"
              rel="noreferrer"
            >
              How it works?
            </Link>
          </div>
        </>
      }
      footer={
        <Redirect>
          <Web3AlertLogo />
          <p>
            You will be redirected to the partner's website{" "}
            <Link href={web3AlertUrl} target="_blank" rel="noreferrer">
              web3alert.io
            </Link>{" "}
            to complete the alert creation.
          </p>
          <a
            href={`${web3AlertUrl}/add-an-alert?network=thegraph-arbitrum&step=3&options=${redirectOptions}`}
            aria-disabled={!isValid}
            target="_blank"
            rel="noreferrer"
            className="redirect-link"
            onMouseDown={preventDefault}
          >
            <span>Create alert</span>
            <ArrowRight color={isValid ? undefined : "#d2d2d2"} />
          </a>
        </Redirect>
      }
    >
      <Form
        id={id}
        isDelegator={isDelegator}
        isIndexer={isIndexer}
        setIsValid={setIsValid}
        setRedirectOptions={setRedirectOptions}
      />
    </Modal>
  );
};
