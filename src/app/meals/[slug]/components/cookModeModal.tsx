import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';
import { CookingPot } from 'lucide-react';
import Steps from '@/app/meals/[slug]/components/steps';
import React from 'react';
import { MealInstruction } from '@/utils/types/meals';
import ButtonGroup from '@/components/buttonGroup/ButtonGroup';
import { CookingNavigator } from '@/app/meals/[slug]/components/cookNavigator';

export default function CookModeModal({ instructions }: { instructions: MealInstruction[] }) {
  return (
    <Modal>
      <Modal.Trigger asChild>
        <Button>
          <CookingPot size={16} />
          Start Cooking
        </Button>
      </Modal.Trigger>

      <Modal.Dialog>
        <Modal.Header title={'Cooking Mode'}></Modal.Header>

        <Modal.Content>
          <Steps steps={instructions} />
        </Modal.Content>

        <Modal.Footer>
          <ButtonGroup align={'between'}>
            <CookingNavigator steps={instructions} />
            <Modal.Close asChild>
              <Button>Close</Button>
            </Modal.Close>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
  );
}
