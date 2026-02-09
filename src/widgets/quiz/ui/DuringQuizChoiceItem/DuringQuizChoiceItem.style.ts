import { flexBetween } from "@/shared/values/_flex";
import { colors } from "@/shared/values/_foundation";
import { shapes } from "@/shared/values/_shape";
import { typography } from "@/shared/values/typography.mixin";
import styled from "styled-components";

interface State {
    $state: "correct" | "different" | "disabled" | "selected";
}

export const container = styled.div<State>`
    ${flexBetween}
    align-items: center;
    padding: 16px 24px;
    border-radius: ${shapes.xsmall};

    border: 1px solid 
    ${props => 
        (props.$state === "disabled"? colors.main.assistive:
            (props.$state === "selected"? colors.secondary.alternative:
            (props.$state === "correct"? colors.state.success: colors.state.error))
        )
    };

    background-color:
    ${props => 
        (props.$state === "disabled"? colors.background.Dark:
            (props.$state === "selected"? colors.secondary.alternative:
            (props.$state === "correct"? "#EDFAF0": "#FDE8EF"))
        )
    };


`

export const text = styled.text<State>`
    color:
    ${props => 
        (props.$state === "disabled"? colors.secondary.alternative:
            (props.$state === "selected"? colors.main.alternative:
            (props.$state === "correct"? colors.state.success: colors.state.error))
        )
    };
    ${typography('body','lg','medium')};
`